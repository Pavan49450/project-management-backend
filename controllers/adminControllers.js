const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/admin");

// Register admin
exports.registerAdmin = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let admin = await Admin.findOne({ email });

    if (admin) {
      return res.status(400).json({ msg: "Admin already exists" });
    }

    admin = new Admin({
      name,
      email,
      password,
    });

    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(password, salt);

    await admin.save();

    const payload = {
      admin: {
        id: admin.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await Admin.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Email not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const payload = {
      user: {
        id: user.id,
        role: user.role,
      },
    };

    jwt.sign(
      payload,
      "your_jwt_secret",
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        res.json({ token, id: user.id, role: user.role });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getAdminWithChildren = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.adminId).populate("children");
    if (!admin) {
      return res.status(404).json({ msg: "Admin not found" });
    }
    res.json(admin);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().populate("children");
    res.json(admins);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.updateAdmin = async (req, res) => {
  const { name, email, iterations } = req.body;
  const adminId = req.params.adminId;

  try {
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ msg: "Admin not found" });
    }

    admin.name = name || admin.name;
    admin.email = email || admin.email;
    admin.iterations = iterations || admin.iterations;
    // if (password) {
    //   const salt = await bcrypt.genSalt(10);
    //   admin.password = await bcrypt.hash(password, salt);
    // }

    await admin.save();

    res.json(admin);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.deleteAdmin = async (req, res) => {
  const adminId = req.params.adminId;

  try {
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ msg: "Admin not found" });
    }

    await User.deleteMany({ admin: adminId });
    await admin.remove();

    res.json({ msg: "Admin and associated users deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
