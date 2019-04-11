Postmedia.Audience.EventType = Postmedia.Audience.EventType || {};
Postmedia.Audience.EventType.UserContent = 5;

if ( typeof Postmedia.Analytics.NLP == 'object' ) {
    /**
     * Processing NLP entities
     * @param object|string
     * @returns array()
    */
    Postmedia.Analytics.NLP.EntityParser = function( NLP_Entities ) {
        var Entity_Return = [];
        
        if ( typeof NLP_Entities == 'object' ) {
            var NLP_Entities_count = NLP_Entities.length;
            for ( var i = 0; i < NLP_Entities_count; i++ ) {
                var Entity_children_2 = NLP_Entities[i].children;
                var Entity_children_2_count = Entity_children_2.length;
                for ( var j = 0; j < Entity_children_2_count; j++ ) {
                    var Entity_children_3 = Entity_children_2[j].children;
                    var Entity_children_3_count = Entity_children_3.length;
                    for ( var k = 0; k < Entity_children_3_count; k++ ) {
                        Entity_Return.push( NLP_Entities[i].value + ">" + Entity_children_2[j].value + ">" + Entity_children_3[k].value + "," + Entity_children_3[k].score + "," + Entity_children_3[k].rank );
                    }
                }
            }
        } else if (typeof NLP_Entities === 'string') {
            var entities = NLP_Entities.split('| ');

            entities.forEach(function(entity) {
                Entity_Return.push({
                    value: entity,
                    type: "Entity",
                    score: '',
                    rank: '',
                    level1: '',
                    level2: '',
                    globalPostId: Postmedia.Analytics.ContentId+", "+Postmedia.Analytics.ContentOriginId,
                });
            });
        }

        return Entity_Return;
    };

    /**
     * Processing NLP categories
     * @param object|string
     * @returns array()
    */
    Postmedia.Analytics.NLP.CategoryParser = function( NLP_Catgories ) {
        var Category_Return = [];
        
        if ( typeof NLP_Catgories == 'object' ) {
            var NLP_Catgories_count = NLP_Catgories.length;
            for ( var i = 0; i < NLP_Catgories_count; i++ ) {
                Category_Return.push( NLP_Catgories[i].value + "," + NLP_Catgories[i].score );
            }
        } else if ( typeof NLP_Catgories === 'string') {
            var categories = NLP_Catgories.split(', '),
                formattedCategory = {};

            categories.forEach(function(value, index) {
                if (index % 2 === 0) { // Every second value in the array is the score
                    formattedCategory.score = value;
                    formattedCategory.type = "Category";
                    formattedCategory.globalPostId = Postmedia.Analytics.ContentId+", "+Postmedia.Analytics.ContentOriginId,
                    Category_Return.push(formattedCategory);
                    formattedCategory = {};
                } else {
                    formattedCategory.value = value;
                }
            });
        }

        return Category_Return;
    };

    /**
     * Processing NLP Key topics
     * @param object|string
     * @returns array()
    */
    Postmedia.Analytics.NLP.TopicsParser = function( NLP_Keytopics ) {
        var Keytopic_Return = [];

        if ( typeof NLP_Keytopics == 'object' ) {
            var NLP_Keytopics_count = NLP_Keytopics.length;
            for ( var i = 0; i < NLP_Keytopics_count; i++ ) {
                Keytopic_Return.push( NLP_Keytopics[i].value + "," +  NLP_Keytopics[i].score );
            }
        } else if ( typeof NLP_Keytopics === 'string'){
            var topics = NLP_Keytopics.split('| ');

            topics.forEach(function(topic) {
                Keytopic_Return.push({
                    value: topic,
                    type: "Topics",
                    score: '',
                    globalPostId: Postmedia.Analytics.ContentId+", "+Postmedia.Analytics.ContentOriginId
                });
            });
        }

        return Keytopic_Return;
    };
}

Postmedia.Audience.logNLPTags = function() {
    try {
        if ( typeof arguments[0] != 'object' ) {
            throw "NLP data must be an object.";
        }

        var NLP_Entities = Postmedia.Analytics.NLP.EntityParser( Postmedia.Analytics.NLP.entities || Postmedia.Analytics.NLP.EntityTags );
        var NLP_Catgories = Postmedia.Analytics.NLP.CategoryParser( Postmedia.Analytics.NLP.categories || Postmedia.Analytics.NLP.CategoryTags );
        var NLP_Keytopics = Postmedia.Analytics.NLP.TopicsParser( Postmedia.Analytics.NLP.key_topics || Postmedia.Analytics.NLP.KeyTopics );

        /**
         * Loggin NLP entities into mParticle
        */
        if ( NLP_Entities ) {
            if (Postmedia.Analytics.NLP.entities) {
                var NLP_Entities_count = NLP_Entities.length;
                for ( var i = 0; i < NLP_Entities_count; i++ ) {
                    var Entity_children_2 = NLP_Entities[i].children;
                    var Entity_children_2_count = Entity_children_2.length;
                    for ( var j = 0; j < Entity_children_2_count; j++ ) {
                        var Entity_children_3 = Entity_children_2[j].children;
                        var Entity_children_3_count = Entity_children_3.length;
                        for ( var k = 0; k < Entity_children_3_count; k++ ) {
                            Postmedia.Audience.logEvent( "NLP Tag", Postmedia.Audience.EventType.UserContent, {
                                "Value": Entity_children_3[k].value,
                                "Type": "Entity",
                                "Score": Entity_children_3[k].score,
                                "Relatedness": Entity_children_3[k].rank,
                                "Level 1": NLP_Entities[i].value,
                                "Level 2": Entity_children_2[j].value,
                                "Global Post ID": Postmedia.Analytics.ContentId+", "+Postmedia.Analytics.ContentOriginId,
                            }, { "Google.NonInteraction" : true } );
                        }
                    }
                }
            } else {
                for ( var i = 0; i < NLP_Entities.length; i++ ) {
                    Postmedia.Audience.logEvent( "NLP Tag", Postmedia.Audience.EventType.UserContent || 5, {
                        "Value": NLP_Entities[i].value,
                        "Type": NLP_Entities[i].type,
                        "Score": NLP_Entities[i].score,
                        "Relatedness": NLP_Entities[i].rank,
                        "Level 1": NLP_Entities[i].level1,
                        "Level 2": NLP_Entities[i].level2,
                        "Global Post ID": NLP_Entities[i].globalPostId
                    }, { "Google.NonInteraction" : true } );
                }
            }
        }

        /**
         * Logging NLP categories into mParticle
        */
        if ( NLP_Catgories ) {
            var NLP_Catgories_count = NLP_Catgories.length;
            for ( var i = 0; i < NLP_Catgories_count; i++ ) {
                Postmedia.Audience.logEvent( "NLP Tag", Postmedia.Audience.EventType.UserContent, {
                    "Value": NLP_Catgories[i].value,
                    "Type": NLP_Catgories[i].type,
                    "Score": NLP_Catgories[i].score,
                    "Global Post ID": NLP_Catgories[i].globalPostId
                }, { "Google.NonInteraction" : true } );
            }
        }

        /**
         * Loggin NLP key topics into mParticle
        */
        if ( NLP_Keytopics ) {
          var NLP_Keytopics_count = NLP_Keytopics.length;
            for ( var i = 0; i < NLP_Keytopics_count; i++ ) {
                Postmedia.Audience.logEvent( "NLP Tag", Postmedia.Audience.EventType.UserContent, {
                    "Value": NLP_Keytopics[i].value,
                    "Type": NLP_Keytopics[i].type,
                    "Score": NLP_Keytopics[i].score,
                    "Global Post ID": NLP_Keytopics[i].globalPostId
                }, { "Google.NonInteraction" : true } );
            }
        }
        return true;
    } catch( e ) {
        console.error("Postmedia.Audience.logEvent -", e); return false;
    }
};

if ( Postmedia.Analytics.NLP && Postmedia.Audience && Postmedia.Audience.EventType) {
    Postmedia.Audience.logNLPTags( Postmedia.Analytics.NLP ); 
}
