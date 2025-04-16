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
    console.log("Adding domain...");
    const { orgId, name, domain } = req.body;

    if (!name || !domain) {
      return res
        .status(400)
        .json({ success: false, error: "Domain name and URL are required" });
    }

    const organization = await Organization.findById(orgId);
    if (!organization) {
      return res
        .status(404)
        .json({ success: false, error: "Organization not found" });
    }

    // Add new domain to the Map
    organization.domains.set(name, domain);
    await organization.save();

    res.status(200).json({ success: true, data: organization });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.removeDomain = async (req, res) => {
  try {
    const { orgId, name } = req.body;

    if (!orgId || !name) {
      return res
        .status(400)
        .json({ success: false, error: "Organization ID and domain name are required" });
    }

    const organization = await Organization.findById(orgId);
    if (!organization) {
      return res
        .status(404)
        .json({ success: false, error: "Organization not found" });
    }

    if (!organization.domains.has(name)) {
      return res
        .status(404)
        .json({ success: false, error: "Domain not found" });
    }

    organization.domains.delete(name);
    await organization.save();

    res.status(200).json({ success: true, data: organization });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

