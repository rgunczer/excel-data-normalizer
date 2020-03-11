const normalization = (function() {

    let rules = {};

    function saveRules() {
        localStorage.setItem('rules', JSON.stringify(rules));
    }

    function load(receivedRules) {
        console.log('normalization-rules->load', receivedRules);

        let localSavedRules = localStorage.getItem('rules');
        if (localSavedRules) {
            localSavedRules = JSON.parse(localSavedRules);
        } else {
            localSavedRules = {};
        }

        rules = { ...receivedRules, ...localSavedRules };
    }

    function create(columnName, fromValuesList, toValue) {
        if (!rules[columnName]) {
            rules[columnName] = [];
        }

        rules[columnName].push({
            from: fromValuesList,
            to: toValue
        });
        saveRules();
    }

    function getRulesForColumn(columnName) {
        return rules[columnName];
    }

    function getAllRules() {
        return {...rules};
    }

    function remove(columnName, ruleIndices) {
        const indices = [];
        for (let i = 0; i < ruleIndices.length; ++i) {
            indices.push(parseInt(ruleIndices[i]));
        }

        for (let i = rules[columnName].length - 1; i > -1; --i) {
            if (indices.includes(i)) {
                rules[columnName].splice(i, 1);
            }
        }
        saveRules();
    }

    function getNormalizedValueFor(columnName, originalValue) {
        const ruleArr = rules[columnName];
        for(let i = 0; i < ruleArr.length; ++i) {
            const ruleItem = ruleArr[i];
            if (ruleItem.from.includes(originalValue)) {
                return ruleItem.to;
            }
        }
        return '';
    }

    return {
        load,
        create,
        remove,
        getRulesForColumn,
        getAllRules,
        getNormalizedValueFor
    };

})();
