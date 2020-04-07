const Organisation = require("./model");
const { organisationInclude } = require("../helper-files/include-definitions");

const createOrganisation = async organisationData => {
  return await Organisation.create(organisationData);
};

const getOneOrganisation = async organisationId => {
  return await Organisation.findByPk(organisationId, organisationInclude);
};

const updateOrganisation = async (updateData, organisationId) => {
  return await Organisation.update(updateData, {
    where: { id: organisationId }
  });
};

module.exports = { getOneOrganisation, createOrganisation, updateOrganisation };
