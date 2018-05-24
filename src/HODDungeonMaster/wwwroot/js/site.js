// Write your Javascript code.
$(document).ready(function () {
    var TileName = "";
    var TypeCopy = "";
    var TileWeather = "";
    var PortalType = "";
    var TileNorth, TileSouth, TileEast, TileWest;
    // Spawn Point Vars
    var disabled,
        FighterAi,
        Faction,
        Wander,
        LeaderName,
        LeaderRace,
        LeaderFighter,
        LeaderGender,
        MinionName,
        MinionRace,
        MinionGender,
        message = function (msg, autohide) {
            $('.server_message').text('');
            $('.server_message').text(msg);
            $('#msgModal').modal();
            if (!autohide) return;
            setTimeout(function () {
                $('#msgModal').modal('hide');
            }, 1500);
        };

    $("#reOrderPanels").click(function() {
        reOrderPanels();
        SaveSettings('reOrderPanels', $('#reOrderPanels').prop('checked'));
    });
    $("#reOrderPanels").change(function () {
        reOrderPanels();
        SaveSettings('reOrderPanels', $('#reOrderPanels').prop('checked'));
    });

    function reOrderPanels(){
        if ($('#reOrderPanels').prop('checked')) {
            $(".inspector")
                .sortable({
                    placeholder: "ui-state-highlight"
                });
            $(".inspector").disableSelection();
            $(".leftcolumn")
                .sortable({
                    placeholder: "ui-state-highlight"
                });
            $(".leftcolumn").disableSelection();
        }
        else {
            $(".inspector").sortable({
                cancel: ".panel"
            });
            $(".inspector").enableSelection();

            $(".leftcolumn").sortable({
                cancel: ".panel"
            });
            $(".leftcolumn").enableSelection();
        }
    };

    //Left Side
    $("#LegendHeader").click(function() {
        $("#LegendBody").slideToggle();
    });
    $("#PortalsHeader").click(function() {
        $("#Portals").slideToggle();
    });
    $("#CheckpointsHeader").click(function() {
        $("#Checkpoints").slideToggle();
    });
    $("#GuildHallsHeader").click(function() {
        $("#GuildHalls").slideToggle();
    });
    $("#TogglesHeader").click(function () {
        $("#TogglesBody").slideToggle();
    });

    $("#ShowTileNames").change(function () {
        tileNamePanel();
        SaveSettings('ShowTileNames', $("#ShowTileNames").prop('checked'));
    });

    function tileNamePanel() {
        $("#TileNamesList").slideToggle($("#ShowTileNames").is(':checked'));
    }

    $("#ShowSpawnPanel").change(function () {
        spawnPanel();
        SaveSettings('ShowSpawnPanel', $("#ShowSpawnPanel").prop('checked'));
    });

    function spawnPanel() {
        $("#SpawnListContainer").slideToggle($("#ShowSpawnPanel").is(':checked'));
    }

    $("#TileNamesHeader").click(function () {
        $("#TileNames").slideToggle();
    });
    $("#SpawnListHeader").click(function () {
        $("#SpawnList").slideToggle();
    });

    toggleWeather();

    $("#DisplaySettings").click(function() {
        $('#SettingsModal').modal('toggle');
    });
    //Right Side
    $("#DungeonPropertiesHeader").click(function () {
        $("#DungeonProperties").slideToggle();
    });
    $("#TileInspectorHeader").click(function () {
        $("#TileInspector").slideToggle();
    });
    $("#NodePortalsHeader").click(function () {
        if ($('#pinPortals').prop('checked')) {
            $('#NodePortals').show();
        }
        else {
            $('#NodePortals').slideToggle();
        }
    });
    $("#SpawnPointsHeader").click(function () {
        if ($('#pinSpawnPanel').prop('checked')) {
            $('#SpawnPoints').show();
        }
        else {
            $('#SpawnPoints').slideToggle();
        }
    });

    $("#WhiteListHeader").click(function () {
        $("#WhiteListBody").slideToggle();
    });

    $("#GuildListPanelHeader").click(function () {
        $("#GuildListBody").slideToggle();
    });

    $("#CommandsHeader").click(function () {
        $("#Commands").slideToggle();
    });

    $("#EventsHeader").click(function () {
        $("#Events").slideToggle();
    });

    $('#is_locked').click(function (e) {
        if ($('#is_locked').prop('checked')) {
            $('#WhiteListContainer').show();
        } else {
            $('#WhiteListContainer').hide();
        }
    });
    

    //COPY/PASTE
    $('#copy-TileName').click(function (e) {CopyTileName();});
    $('#paste-TileName').click(function(e) {PasteTileName();});
    $('#copy-MapType').click(function (e) {CopyMapType();});
    $('#paste-MapType').click(function (e) {PasteMapType();});
    $('#copy-PortalType').click(function (e) {CopyPortalType();});
    $('#paste-PortalType').click(function (e) {PastePortalType();});
    $('#copy-TileWeather').click(function (e) {CopyTileWeather();});
    $('#paste-TileWeather').click(function (e) { PasteTileWeather(); });


    $('#copy-TileWalls').click(function (e) { CopyTileWalls(); });
    $('#paste-TileWalls').click(function (e) { PasteTileWalls(); });

    $('#paste-AllTile').click(function (e) {
        PasteTileName();
        PasteMapType();
        PastePortalType();
        PasteTileWeather();
    });
    $('#copy-AllTile').click(function (e) {
        CopyTileName();
        CopyMapType();
        CopyPortalType();
        CopyTileWeather();
    });

    function CopyTileName() { 
        if ($('#tile_name').val()) {
            TileName = $('#tile_name').val();
        }
    }
    function PasteTileName() {
        if (TileName) {
            $('#tile_name').val(TileName);
            $('#tile_name').trigger('change');
        }
    }
    function CopyMapType() {
        if ($('#maptype').val()) {
            TypeCopy = $('#maptype').val();
        }
    }
    function PasteMapType() {
        if (TypeCopy) {
            $('#maptype').val(TypeCopy);
            $('#maptype').trigger('change');
        }
    }
    function CopyPortalType() {
        if ($('#portal_type').val()) {
            PortalType = $('#portal_type').val();
        }
    }
    function PastePortalType() {
        if (PortalType) {
            $('#portal_type').val(PortalType);
            $('#portal_type').trigger('change');
        }
    }
    function CopyTileWeather() {
        if ($('#weathertype').val()) {
            TileWeather = $('#weathertype').val();
        }
    }
    function PasteTileWeather() {
        if (TileWeather) {
            $('#weathertype').val(TileWeather);
            $('#weathertype').trigger('change');
        }
    }

    // Walls

    //function CopyTileWalls() {
    //    TileNorth = $('#tile_north').is(':checked');
    //    TileSouth = $('#tile_south').is(':checked');
    //    TileEast = $('#tile_east').is(':checked');
    //    TileWest = $('#tile_west').is(':checked');
    //}

    //function PasteTileWalls() {
    //    $('#tile_north').prop('checked', TileNorth);
    //    $('#tile_south').prop('checked', TileSouth);
    //    $('#tile_east').prop('checked', TileEast);
    //    $('#tile_west').prop('checked', TileWest);
    //    $('#tile_north').trigger('click');
    //    $('#tile_south').trigger('click');
    //    $('#tile_east').trigger('click');
    //    $('#tile_west').trigger('click');
    //}

    $('#copy-AllSpawn').click(function (e) { CopyAllSpawn(); });
    $('#paste-AllSpawn').click(function (e) { PasteAllSpawn(); });
    function CopyAllSpawn() {
        disabled = $('#spawn_is_disabled').val();
        FighterAi = $('#spawn_fighteraitype').val();
        Faction = $('#spawn_factiontype').val();
        Wander = $('#spawn_maxwander_distance').val();
        LeaderName = $('#spawn_leadername_override').val();
        LeaderRace = $('#spawn_leaderrace').val();
        LeaderFighter = $('#spawn_leadertype').val();
        LeaderGender = $('#spawn_leadergender').val();
        MinionName = $('#spawn_minionname_override').val();
        MinionRace = $('#spawn_minionrace').val();
        MinionGender = $('#spawn_miniongender').val();
    }
    function PasteAllSpawn() {
        if (disabled) {
            $('#spawn_is_disabled').val(disabled);
            $('#spawn_is_disabled').trigger('change');}
        if (FighterAi) {
            $('#spawn_fighteraitype').val(FighterAi);
            $('#spawn_fighteraitype').trigger('change');}
        if (Faction) {
            $('#spawn_factiontype').val(Faction);
            $('#spawn_factiontype').trigger('change');}
        if (Wander) {
            $('#spawn_maxwander_distance').val(Wander);
            $('#spawn_maxwander_distance').trigger('change');
        } else {
            $('#spawn_maxwander_distance').val(2);
            $('#spawn_maxwander_distance').trigger('change');
        }
        if (LeaderName){
            $('#spawn_leadername_override').val(LeaderName);
            $('#spawn_leadername_override').trigger('change');}
        if (LeaderRace){
            $('#spawn_leaderrace').val(LeaderRace);
            $('#spawn_leaderrace').trigger('change');}
        if (LeaderFighter){
            $('#spawn_leadertype').val(LeaderFighter);
            $('#spawn_leadertype').trigger('change');}
        if (LeaderGender){
            $('#spawn_leadergender').val(LeaderGender);
            $('#spawn_leadergender').trigger('change');}
        if (MinionName){
            $('#spawn_minionname_override').val(MinionName);
            $('#spawn_minionname_override').trigger('change');}
        if (MinionRace){
            $('#spawn_minionrace').val(MinionRace);
            $('#spawn_minionrace').trigger('change');}
        if (MinionGender){
            $('#spawn_miniongender').val(MinionGender);
            $('#spawn_miniongender').trigger('change');
        }
    }

    $('#Nullify-AllTile').click(function (e) { NullifyTile(); });

    function NullifyTile() {

        if ($('.ui-selected').hasClass('spawn') || $('.active').hasClass('spawn')) {
            message("You can't Nullify this tile while it has a spawn on it!", false);
        }
        else {
            //check to see if there was a problem (portal)
            if (!$('.ui-selected').hasClass('portal') && !$('.active').hasClass('portal')) {
                //wipe tile properties
                $('#tile_name').val('NULL');
                $('#tile_name').trigger('change');
                $('#maptype').val('NULL');
                $('#maptype').trigger('change');
                $('#portal_type').val('NULL');
                $('#portal_type').trigger('change');
                $('#weathertype').val('NULL');
                $('#weathertype').trigger('change');
                $('#spawn_is_disabled').val(disabled);
                $('#spawn_is_disabled').trigger('change');
                $('#is_checkpoint').prop('checked', true);
                $('#is_checkpoint').trigger('click');
                //enable all walls

                if (!$('#tile_north').is(':disabled')) {
                    $('#tile_north').prop('checked', true);
                    $('#tile_north').trigger('click');
                }
                if (!$('#tile_south').is(':disabled')) {
                    $('#tile_south').prop('checked', true);
                    $('#tile_south').trigger('click');
                }
                if (!$('#tile_east').is(':disabled')) {
                    $('#tile_east').prop('checked', true);
                    $('#tile_east').trigger('click');
                }
                if (!$('#tile_west').is(':disabled')) {
                    $('#tile_west').prop('checked', true);
                    $('#tile_west').trigger('click');
                }
                $('.active').addClass('NULL');
            } else {
                message("You can't Nullify this tile while it has a portal!", false);
                return;
            }
        }
    }    
    
    $('#showWeather').change(function (e) {
        toggleWeather();        
        SaveSettings('showWeather', $(this).prop('checked'));
    });

    function toggleWeather() {
        if ($('#showWeather').prop('checked')) {
            $('.dungeongrid').addClass('showWeather');
        } else {
            $('.dungeongrid').removeClass('showWeather');
        }
    }

    $('#showSpawns').change(function (e) {
        toggleSpawns();
    });

    $('#portal_source_dungeonid').blur(function (e) {
        updateSourceDungeonName();
    });
    $('#portal_source_dungeonid').change(function (e) {
        updateSourceDungeonName();
    });
    $('#portal_source_dungeonid').click(function (e) {
        updateSourceDungeonName();
    });
    $('#portal_target_dungeonid').blur(function (e) {
        updateTargetDungeonName();
    });
    $('#portal_target_dungeonid').change(function (e) {
        updateTargetDungeonName();
    });
    $('#portal_target_dungeonid').click(function (e) {
        updateTargetDungeonName();
    });

    $('#QuickDropdownEscape').change(function () {
        SaveSettings('QuickDropdownEscape', $(this).prop('checked'));
    });

    function updateSourceDungeonName() {
        var $id = $('#portal_source_dungeonid').val();
        $('#sourceDungeonName').html(DungeonNamebyId($id));
    }
    function updateTargetDungeonName() {
        var $id = $('#portal_target_dungeonid').val();
        $('#targetDungeonName').html(DungeonNamebyId($id));
    }

    function DungeonNamebyId($id) {
        var $dungeonName = "";
        var dungeonOptionByID = "#dungeonselect option[value='" + $id + "']";
        $dungeonName = $(dungeonOptionByID).text();
        if ($dungeonName) {
            $dungeonName = $dungeonName.split(' - ')[1];
            $dungeonName = $dungeonName.replace('(locked)', '');
            return $dungeonName;
        } else
            return ' ';
    }   

    //Check for saved settings on browser    
    LoadSettings(function () {
        $('#showWeather').prop('checked', GetSettings('showWeather'));        
        $('#highlightSpawns').prop('checked', GetSettings('highlightSpawns'));
        //$('#ShowTileNames').prop('checked', GetSettings('ShowTileNames'));
        //$('#ShowSpawnPanel').prop('checked', GetSettings('ShowSpawnPanel'));
        $('#QuickDropdownEscape').prop('checked', GetSettings('QuickDropdownEscape'));

        $('#showWeather').trigger('change');
        $('#highlightSpawns').trigger('change');
        $('#QuickDropdownEscape').trigger('change');
        //$('#reOrderPanels').prop('checked', GetSettings('reOrderPanels'));
        //$('#reOrderPanels').trigger('click');
    });

    //ALPHA SORT MAP TYPE DROPDOWN
    $(document).ready(function() {
        var sel = $('#maptype');
        var selected = sel.val(); // cache selected value, before reordering
        var opts_list = sel.find('option');
        opts_list.sort(function(a, b) {return $(a).text() > $(b).text() ? 1 : -1;});
        sel.html('').append(opts_list);
        $('#maptype option[value="0"]').prependTo(sel);
        sel.val(selected); // set cached selected value
    });

});