const Organization = require("../models/organization");

exports.createOrganization = async (req, res) => {
  try {
    if (!req.body.name) {
      return res
        .status(400)
        .json({ success: false, error: "Organization name is required" });
    }

    // Convert domains to Map if provided
    if (req.body.domains) {
      req.body.domains = req.body.domains.map(
        (domain) => new Map(Object.entries(domain))
      );
    }

    const organization = await Organization.create(req.body);
    res.status(201).json({ success: true, data: organization });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.addDomain = async (req, res) => {
  try {
    const { organizationId } = req.body.orgId;
    const domainData = req.body;

    if (!domainData || Object.keys(domainData).length === 0) {
      return res
        .status(400)
        .json({ success: false, error: "Domain data is required" });
    }

    const existingOrg = await Organization.findById(organizationId);
    if (!existingOrg) {
      return res
        .status(404)
        .json({ success: false, error: "Organization not found" });
    }

    const organization = await Organization.findByIdAndUpdate(
      organizationId,
      { $push: { domains: new Map(Object.entries(domainData)) } },
      { new: true }
    );

    res.status(200).json({ success: true, data: organization });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res
        .status(400)
        .json({ success: false, error: "Invalid organization ID" });
    }
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.removeDomain = async (req, res) => {
  try {
    const { organizationId } = req.params;
    const { index } = req.query;

    const existingOrg = await Organization.findById(organizationId);
    if (!existingOrg) {
      return res
        .status(404)
        .json({ success: false, error: "Organization not found" });
    }

    if (index < 0 || index >= existingOrg.domains.length) {
      return res
        .status(404)
        .json({ success: false, error: "Invalid domain index" });
    }

    existingOrg.domains.splice(index, 1);
    await existingOrg.save();

    res.status(200).json({ success: true, data: existingOrg });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res
        .status(400)
        .json({ success: false, error: "Invalid ID format" });
    }
    res.status(400).json({ success: false, error: error.message });
  }
};
