const isRequire = (item) => { throw new TypeError(item + ' is queried!'); };

const checkType = async (item = isRequire('item'), ...types) => {
    try {
        const type = item.constructor.name.toLowerCase();
        if (!types.includes(type)) {
            throw new TypeError('only types: ' + ((types.length) ? types.join(', ') : types[0]) + ' is allowed!');
        }
    } catch (err) {
        throw new TypeError('only types: ' + ((types.length) ? types.join(', ') : types[0]) + ' is allowed!');
    }
};

module.exports = {
    isRequire,
    checkType
};
