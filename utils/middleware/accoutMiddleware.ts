const validationData = async (req, res, next) => {
    next({ type: 'uniqueEmail' });
};

export default {
    validationData,
};
