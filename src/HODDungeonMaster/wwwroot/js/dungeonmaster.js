(function () {
    'use strict';
    var Portal = function(sourcenode, selectednode) {
            this.TargetDungeonId = "",
            this.TargetNodeX = 0,
            this.TargetNodeY = 0,
            this.SourceNode = sourcenode,
            this.SelectedNode = selectednode;
        },
        SpawnPoint = function(id, selectedNode) {
            this.DungeonTemplateId = id,
            this.NodeX = selectedNode.x,
            this.NodeY = selectedNode.y,
            this.isDisabled = false,
            this.DireFaction = 0,
            this.FighterAiType = 0,
            this.MaxWanderDistance = 0,
            this.LeaderNameOverride = "",
            this.LeaderRaceOverride = 0,
            this.LeaderTypeOverride = 0,
            this.LeaderSexOverride = 0,
            this.MinionNameOverride = "",
            this.MinionRaceOverride = 0,
            this.MinionSexOverride = 0,
            this.OnKillTitle = "";
            this.OnKillGateKey = "";
        },
        startingTile = '#r8c8',
        gridSize = 15,
        selectedNode = null,
        tileNodes = [],
        dungeonCSV = [],
        CSVData,
        nodebuilder = function(x, y) {
            return $('#r' + x + 'c' + y);
        },
        nodebuster = function(node) {
            if (node.selector) {
                var xDef = node.selector.substring(2, node.selector.indexOf('c')),
                    yDef = node.selector.substring(node.selector.indexOf('c') + 1, node.selector.length);
                return {
                    x: parseInt(xDef),
                    y: parseInt(yDef)
                };
            }
            return null;
        },
        message = function(msg, autohide) {
            $('.server_message').text('');
            $('.server_message').text(msg);
            $('#msgModal').modal();
            if (!autohide) return;
            setTimeout(function() {
                    $('#msgModal').modal('hide');
                },
                1500);
        },
        enumGetVal = function(id, val) {
            return $(id).val(val).text();
        };      
   


   if (typeof dungeonJSON !== 'undefined') {
        var dungeonObj = Load();
        enumGetVal('#portaltype', 2);
        //Select Starting Tile
        $(startingTile).trigger('click');        

        //Starting Dungeon
        $('#dungeonselect option:contains(\"' + dungeonObj.TemplateId + '\")').prop('selected', true);
        
        $('#tile_north').click(function () {
            NorthTile();
            CheckForAllWalls();
        });
        $('#tile_south').click(function() {
            SouthTile();
            CheckForAllWalls();
        });
        $('#tile_east').click(function () {
            EastTile();
            CheckForAllWalls();
        });
        $('#tile_west').click(function () {
            WestTile();
            CheckForAllWalls();
        });

        $('#tile_all').click(function () {
            tile_All();            
        });

        /* KEYBOARD CONTROLS */        
        $(document).keydown(function (e) {
            //exit if user is in a input field
            if ($('input:focus').length > 0) { return; }
            if ($('textarea:focus').length > 0) { return; }            

            if (!$('#QuickDropdownEscape').is(':checked')) {
                if ($('select:focus').length > 0) { return; }                
            }            

            var x, y;

            if (e.shiftKey) {
                switch (e.keyCode) {
                    case 37:
                        $('#tile_west').trigger('click');
                        break;
                    case 38:
                        $('#tile_north').trigger('click');
                        break;
                    case 39:
                        $('#tile_east').trigger('click');
                        break;
                    case 40:
                        $('#tile_south').trigger('click');
                        break;
                    case 13:
                        $('#tile_all').trigger('click');
                        break;
                        /* Delete Key */
                    case 46:
                        e.preventDefault();
                        $('#Nullify-AllTile').trigger('click');
                        break;
                        /* end Key */
                    case 35:
                        e.preventDefault();
                        $('#paste-AllTile').trigger('click');
                        break;
                        /* home Key */
                    case 36:
                        e.preventDefault();
                        $('#copy-AllTile').trigger('click');
                        break;
                }
            }
            else if (!e.shiftKey) {
                if (selectedNode != null) {
                    if (selectedNode.x >= 0 && selectedNode.x <= 15 && selectedNode.y <= 15 && selectedNode.y >= 0) {
                        x = selectedNode.x;
                        y = selectedNode.y;
                        switch (e.keyCode) {
                            /* Movement - WORKS WITH CLICK EVENTS*/
                            case 37:
                                e.preventDefault();
                                x--;
                                $("#r" + x + "c" + y).trigger("click");
                                break;
                            case 38:
                                e.preventDefault();
                                y++;
                                $("#r" + x + "c" + y).trigger("click");
                                break;
                            case 39:
                                e.preventDefault();
                                x++;
                                $("#r" + x + "c" + y).trigger("click");
                                break;
                            case 40:
                                e.preventDefault();
                                y--;
                                $("#r" + x + "c" + y).trigger("click");
                                break;
                            /* Delete Key */
                            case 46:
                                e.preventDefault();
                                $('#Nullify-AllTile').trigger('click');
                                break;
                            /* end Key */
                            case 35:
                                e.preventDefault();
                                $('#paste-AllTile').trigger('click');
                                break;
                            /* home Key */
                            case 36:
                                e.preventDefault();
                                $('#copy-AllTile').trigger('click');
                                break;
                        };
                    }
                }
            }
            if ($('#useWASD').is(':checked')) {
                if (e.shiftKey) {
                    if (selectedNode != null) {
                        if (selectedNode
                            .x >=
                            0 &&
                            selectedNode.x <= 15 &&
                            selectedNode.y <= 15 &&
                            selectedNode.y >= 0) {
                            x = selectedNode.x;
                            y = selectedNode.y;
                            switch (e.keyCode) {
                            case 65:
                                e.preventDefault();
                                x--;
                                $("#r" + x + "c" + y).trigger("click");
                                break;
                            case 87:
                                e.preventDefault();
                                y++;
                                $("#r" + x + "c" + y).trigger("click");
                                break;
                            case 68:
                                e.preventDefault();
                                x++;
                                $("#r" + x + "c" + y).trigger("click");
                                break;
                            case 83:
                                e.preventDefault();
                                y--;
                                $("#r" + x + "c" + y).trigger("click");
                                break;
                            };
                        }
                    }
                }
            }
        });

        function tile_All() {
            var AllTest = $('#tile_all').is(':checked');

            if (selectedNode.y < gridSize) {
                $('#tile_north').prop('checked', AllTest);
            }
            if (selectedNode.y > 0) {
                $('#tile_south').prop('checked', AllTest);
            }
            if (selectedNode.x < gridSize) {
                $('#tile_east').prop('checked', AllTest);
            }
            if (selectedNode.x > 0) {
                $('#tile_west').prop('checked', AllTest);
            }
            NorthTile();
            SouthTile();
            EastTile();
            WestTile();
        }

        function NorthTile() {
            if (selectedNode.y === gridSize) return;
            var topnode = (selectedNode.y + 1) <= 15;
            if ($('#tile_north').is(':checked')) {
                $(selectedNode).addClass('north');
                dungeonObj.Nodes[selectedNode.x][selectedNode.y].N = true;
                if (topnode) {
                    dungeonObj.Nodes[selectedNode.x][selectedNode.y + 1].S = true;
                    nodebuilder(selectedNode.x, selectedNode.y + 1).addClass('south');
                }
            } else {
                $(selectedNode).removeClass('north');
                dungeonObj.Nodes[selectedNode.x][selectedNode.y].N = false;
                if (topnode) {
                    dungeonObj.Nodes[selectedNode.x][selectedNode.y + 1].S = false;
                    nodebuilder(selectedNode.x, selectedNode.y + 1).removeClass('south');
                }
            }
        }
        function SouthTile() {
            if (selectedNode.y === 0) return;
            var bottomnode = (selectedNode.y - 1) >= 0;
            if ($('#tile_south').is(':checked')) {
                $(selectedNode).addClass('south');
                dungeonObj.Nodes[selectedNode.x][selectedNode.y].S = true;
                if (bottomnode) {
                    dungeonObj.Nodes[selectedNode.x][selectedNode.y - 1].N = true;
                    nodebuilder(selectedNode.x, selectedNode.y - 1).addClass('north');
                }
            } else {
                $(selectedNode).removeClass('south');
                dungeonObj.Nodes[selectedNode.x][selectedNode.y].S = false;
                if (bottomnode) {
                    dungeonObj.Nodes[selectedNode.x][selectedNode.y - 1].N = false;
                    nodebuilder(selectedNode.x, selectedNode.y - 1).removeClass('north');
                }
            }
        }
        function EastTile() {
            if (selectedNode.x === gridSize) return;
            var rightnode = (selectedNode.x + 1) <= 15;
            if ($('#tile_east').is(':checked')) {
                $(selectedNode).addClass('east');
                dungeonObj.Nodes[selectedNode.x][selectedNode.y].E = true;
                if (rightnode) {
                    dungeonObj.Nodes[selectedNode.x + 1][selectedNode.y].W = true;
                    nodebuilder(selectedNode.x + 1, selectedNode.y).addClass('west');
                }
            } else {
                $(selectedNode).removeClass('east');
                dungeonObj.Nodes[selectedNode.x][selectedNode.y].E = false;
                if (rightnode) {
                    dungeonObj.Nodes[selectedNode.x + 1][selectedNode.y].W = false;
                    nodebuilder(selectedNode.x + 1, selectedNode.y).removeClass('west');
                }
            }
        }
        function WestTile(){
            if (selectedNode.x === 0) return;
            var leftnode = (selectedNode.x - 1) >= 0;
            if ($('#tile_west').is(':checked')) {
                $(selectedNode).addClass('west');
                dungeonObj.Nodes[selectedNode.x][selectedNode.y].W = true;
                if (leftnode) {
                    dungeonObj.Nodes[selectedNode.x - 1][selectedNode.y].E = true;
                    nodebuilder(selectedNode.x - 1, selectedNode.y).addClass('east');
                }
            } else {
                $(selectedNode).removeClass('west');
                dungeonObj.Nodes[selectedNode.x][selectedNode.y].W = false;
                if (leftnode) {
                    dungeonObj.Nodes[selectedNode.x - 1][selectedNode.y].E = false;
                    nodebuilder(selectedNode.x - 1, selectedNode.y).removeClass('east');
                }
            }
        }
        function CheckForAllWalls() {
            if (
                dungeonObj.Nodes[selectedNode.x][selectedNode.y].N === true && 
                dungeonObj.Nodes[selectedNode.x][selectedNode.y].S === true && 
                dungeonObj.Nodes[selectedNode.x][selectedNode.y].E === true && 
                dungeonObj.Nodes[selectedNode.x][selectedNode.y].W === true
            ) {
                $('#tile_all').prop('checked', true);

            } else {
                $('#tile_all').prop('checked', false);
            }
        }

        $('#maptype').change(function() {
            $('#maptype > option').each(function () {
                $(selectedNode).removeClass(this.text);
            });
            var map = $('#maptype option:selected');
            $(selectedNode).addClass(map.text());
            dungeonObj.Nodes[selectedNode.x][selectedNode.y].Map = Number(map.val());            
        });

        $('#weathertype').change(function () {            
            var weather = $('#weathertype option:selected');
            $('#tile_weather').prop('class', $('#weathertype option:selected').text());
            dungeonObj.Nodes[selectedNode.x][selectedNode.y].Weather = Number(weather.val());
            selectedNode.removeClass('normal');
            selectedNode.removeClass('wet');
            selectedNode.removeClass('cold');
            selectedNode.removeClass('battle');
            if (Number(weather.val()) === 1) {
                selectedNode.addClass('normal');
            }

            if (Number(weather.val()) === 2) {
                selectedNode.addClass('wet');
            }

            if (Number(weather.val()) === 3) {
                selectedNode.addClass('cold');
            }

            if (Number(weather.val()) === 4) {
                selectedNode.addClass('battle');
            }

        });
        
        //Save
        $('#save').click(function(e) {
            e.preventDefault();
            Save(false);
        });
        
        //Open Map All
        $('#openmap').click(function() {
            OpenNodes();
        });

        //Dungeon Select
        $('#dungeonselect').change(function () {               
            var d_select = $('#dungeonselect option:selected').val();
            var postUrl = './Home/SelectDungeon';
            selectedNode = null;
            ResetNav();
            $.post(postUrl, { id: d_select }, function (data) {
                dungeonJSON = JSON.parse(data);
                Load();
                $(startingTile).trigger('click');
                $('#dungeonselect').blur();
            });
        });

        //Author Select
        $('#authorselect').change(function () {
            var a_select = $('#authorselect option:selected').val();
            $('#dungeonselect').children('option').show();
            $('#regionselect').prop('selectedIndex', 0);
            if (a_select != "") {
                
                $('#dungeonselect').children('option').hide();
                $('#dungeonselect').children('option[data-author^="' + a_select + '"]').show();                
                $('#dungeonselect').prop('selectedIndex', -1).val('Select Your Dungeon');
            }                
        });

        //Region Select
        $('#regionselect').change(function () {
            var r_select = $('#regionselect option:selected').val();
            $('#dungeonselect').children('option').show();
            $('#authorselect').prop('selectedIndex', 0);
            if (r_select != "") {                
                $('#dungeonselect').children('option').hide();
                $('#dungeonselect').children('option[data-region^="' + r_select + '"]').show();               
                $('#dungeonselect').prop('selectedIndex', -1).val('Select Your Dungeon');
            }
        });

       //Check Point Type Select
        $('#point_type').change(function () {
            var check_select = $('#point_type option:selected').val();
            dungeonObj.Nodes[selectedNode.x][selectedNode.y].Checkpoint = check_select;
            if (check_select != 0) {
                if (check_select == 1) {
                    $(selectedNode).addClass('checkpoint');
                    $(selectedNode).removeClass('respawn');
                    if (dungeonObj.Nodes[selectedNode.x][selectedNode.y].N) {
                        if ((selectedNode.y + 1) <= gridSize) {
                            nodebuilder(selectedNode.x, selectedNode.y + 1).addClass('protected');
                        }
                    }
                    if (dungeonObj.Nodes[selectedNode.x][selectedNode.y].S) {
                        if ((selectedNode.y - 1) >= 0) {
                            nodebuilder(selectedNode.x, selectedNode.y - 1).addClass('protected');
                        }
                    }
                    if (dungeonObj.Nodes[selectedNode.x][selectedNode.y].E) {;
                        if ((selectedNode.x + 1) <= gridSize) {
                            nodebuilder(selectedNode.x + 1, selectedNode.y).addClass('protected');
                        }
                    }
                    if (dungeonObj.Nodes[selectedNode.x][selectedNode.y].W) {
                        if ((selectedNode.x - 1) >= 0) {
                            nodebuilder(selectedNode.x - 1, selectedNode.y).addClass('protected');
                        }
                    }
                } else {
                    $(selectedNode).addClass('respawn');
                    $(selectedNode).removeClass('checkpoint');
                }
                nodebuilder(selectedNode.x, selectedNode.y).addClass('protected');
            } else {
                $(selectedNode).removeClass('checkpoint');                
                $(selectedNode).removeClass('respawn');
                if ((selectedNode.y + 1) <= gridSize) {
                    nodebuilder(selectedNode.x, selectedNode.y + 1).removeClass('protected');
                }
                if ((selectedNode.y - 1) >= 0) {
                    nodebuilder(selectedNode.x, selectedNode.y - 1).removeClass('protected');
                }
                if ((selectedNode.x + 1) <= gridSize) {
                    nodebuilder(selectedNode.x + 1, selectedNode.y).removeClass('protected');
                }
                if ((selectedNode.x - 1) >= 0) {
                    nodebuilder(selectedNode.x - 1, selectedNode.y).removeClass('protected');
                }
                nodebuilder(selectedNode.x, selectedNode.y).removeClass('protected');
            }

        });

        $('#tile_treasureroom').change(function () {
            var $value_select = $("#tile_treasureroom").is(':checked');
            if ($value_select) {
                nodebuilder(selectedNode.x, selectedNode.y).addClass('treasure');
            }
            else {
                nodebuilder(selectedNode.x, selectedNode.y).removeClass('treasure');
            }
        });

        //Server Command Select
        $('#server_commands').change(function () {
            var s_select = $('#server_commands option:selected').val();
            if(s_select != "")
            {
                $('#server_command').val(s_select + ' ');
                $('#server_command').focus();
            }
            else
            {
                ClearCommand();
            }
        });

        //Add Spawn
        $('#add_spawnpoint').click(function (e) {
            e.preventDefault();

            var s_faction = $('#spawn_factiontype option:selected').val(),
                s_lname = $('#spawn_leadername_override').val(),
                s_mname = $('#spawn_minionname_override').val();
            
            if (s_faction == 0) {
                message('You must specify a Faction for this Spawn Point', false);
                return;
            }

            var sp = new SpawnPoint($('#dungeon_id').val(), selectedNode);
            sp.FighterAiType = $('#spawn_fighteraitype').val();
            sp.DireFaction = s_faction;
            sp.isDisabled = $('#spawn_is_disabled').prop('checked');
            sp.MaxWanderDistance = $('#spawn_maxwander_distance').val();
            sp.LeaderNameOverride = $.trim(s_lname);
            sp.LeaderRaceOverride = $('#spawn_leaderrace').val();
            sp.LeaderTypeOverride = $('#spawn_leadertype').val();
            sp.LeaderSexOverride = $('#spawn_leadergender').val();
            sp.MinionNameOverride = $.trim(s_mname);
            sp.MinionRaceOverride = $('#spawn_minionrace').val();
            sp.MinionSexOverride = $('#spawn_miniongender').val();
            sp.OnKillTitle = $('#spawn_kill_title').val();
            sp.OnKillGateKey = $('#spawn_kill_gatekey').val();
            
            var postUrl = './Home/CreateSpawnPoint';
            $.post(postUrl, {dungeon: dungeonObj, spawnpoint: sp}).done(function (data) {
                dungeonJSON = JSON.parse(data);
                Load();
                message('Spawn Point Complete!', true);
            }).fail(function (data) {
                message(data.responseText, false);
            });

        });

        //Delete Spawn
        $('#delete_spawnpoint').click(function (e) {
            e.preventDefault();
            if (dungeonObj != null && dungeonObj.Nodes[selectedNode.x][selectedNode.y].Spawn == null) return;
            var postUrl = './Home/DeleteSpawnPoint';
            SpawnRadius(false, selectedNode.x, selectedNode.y, 15, "radius");
            $.post(postUrl, { dungeon: dungeonObj, nodeX: selectedNode.x, nodeY: selectedNode.y }).done(function (data) {
                dungeonJSON = JSON.parse(data);
                Load();
                message('Spawn Point Removed!', true);
            }).fail(function (data) {
                message(data.responseText, false);
            });
        });

        //Add Portal
        $('#addportal').click(function (e) {
            e.preventDefault();

            var t_dungeon = $('#portal_target_dungeonid').val(),
                t_x = $('#portal_target_node_x').val(),
                t_y = $('#portal_target_node_y').val(),
                s_dungeon = $('#portal_source_dungeonid').val(),
                s_x = $('#portal_source_node_x').val(),
                s_y = $('#portal_source_node_y').val();

            if (s_dungeon == "" || s_x == "" || s_y == "") {
                message('You must specify a source dungeon and coordinates', false);
                return;
            }
            if (t_dungeon == "" || t_x == "" || t_y == "") {
                message('You must specify a target dungeon and coordinates', false);
                return;
            }

            var selected_d = {
                    DungeonId: $('#dungeon_id').val(),
                    X: selectedNode.x,
                    Y: selectedNode.y
                },
                source_d = {
                    DungeonId: s_dungeon,
                    X: (s_x - 1),
                    Y: (s_y - 1)
                };

            var portal = new Portal(source_d, selected_d);
            portal.TargetDungeonId = t_dungeon;
            portal.TargetNodeX = (t_x - 1);
            portal.TargetNodeY = (t_y - 1);

            var postUrl = './Home/CreatePortal';
            $.post(postUrl,{dungeon: dungeonObj, portaldrop : portal}).done(function(data) {
                dungeonJSON = JSON.parse(data);
                Load();
                message('Portal Complete!', true);
            }).fail(function(data) {
                message(data.responseText, false);
            });
            
        });

        //Delete Portal
        $('#deleteportal').click(function (e) {
            e.preventDefault();

            if (dungeonObj != null && !dungeonObj.Nodes[selectedNode.x][selectedNode.y].IsPortal) return;
            var postUrl = './Home/DeletePortal';
            $.post(postUrl, { dungeon: dungeonObj, nodeX: selectedNode.x, nodeY: selectedNode.y }).done(function (data) {
                dungeonJSON = JSON.parse(data);
                Load();
                message('Portal Link Removed!', true);
            }).fail(function (data) {
                message(data.responseText, false);
            });
        });

        //Jump Portal
        $('#jumpportal').click(function(e) {
            message('Jump!', true);
        });

        $('#randomname').click(function (e) {
            e.preventDefault();
            var maptypeval = $('#maptype option:selected').text(),
                weathertypeval = $('#weathertype option:selected').text();

            maptypeval = maptypeval.toUpperCase() == "NULL" ? "Dungeon" : maptypeval;
            weathertypeval = weathertypeval.toUpperCase() == "NULL" ? "Normal" : weathertypeval;
            
            $.get('./Home/RandomTileName', { maptype: maptypeval, weathertype: weathertypeval }).done(function (data) {
                $('#tile_name').val(data);
                SaveRoom(selectedNode);
            });
        });
        
       
    }

    //Change of spawn radius
    $('#spawn_maxwander_distance').change(function (e) {
        setSpawnDistance();
    });
    $('#spawn_maxwander_distance').click(function (e) {
        setSpawnDistance();
    });
    $('#spawn_factiontype').click(function (e) {
        setSpawnDistance();
    });
    $('#spawn_fighteraitype').click(function (e) {
        setSpawnDistance();
    });
    function setSpawnDistance() {
        SpawnRadius(false, 9, 9, 15, "radius");
        var radius = parseInt($('#spawn_maxwander_distance > option:selected').val());
        var Y = selectedNode.y + 1;
        var X = selectedNode.x + 1;
        SpawnRadius(true, X, Y, radius, "radius");
    }


    $('#highlightSpawns').change(function (e) {
        HighlightAllSpawns();
        SaveSettings('highlightSpawns', $(this).prop('checked'));
    });

    function HighlightAllSpawns(){
        SpawnRadius(false, 9, 9, 15, "Allradius");
        if ($('#highlightSpawns').is(':checked')) {
            for (var rownode = gridSize; rownode >= 0; rownode--) {
                var n = dungeonObj.Nodes[rownode];
                for (var colnode = 0; colnode < n.length; colnode++) {
                    var SpawnNode = n[colnode],
                        $nodeid = nodebuilder(rownode, colnode);
                    if (SpawnNode.Spawn) {
                        var radius = SpawnNode.Spawn.MaxWanderDistance;
                        var Y = colnode + 1;
                        var X = rownode + 1;
                        SpawnRadius(true, X, Y, radius, "Allradius");
                    }
                }
            }
        }
    }

    function HighlightProtectedAreas() {
        for (var rownode = gridSize; rownode >= 0; rownode--) {
            var n = dungeonObj.Nodes[rownode];
            for (var colnode = 0; colnode < n.length; colnode++) {
                var Checkp = n[colnode],
                    $nodeid = nodebuilder(rownode, colnode);
                if (Checkp.Checkpoint == 1) {
                    var Y = colnode + 1;
                    var X = rownode + 1;                    
                    if (Checkp.N) {
                        if ((colnode + 1) <= gridSize) {
                            nodebuilder(rownode, colnode + 1).addClass('protected');
                        }
                    }
                    if (Checkp.S) {
                        if ((colnode - 1) >= 0) {
                            nodebuilder(rownode, colnode - 1).addClass('protected');
                        }
                    }
                    if (Checkp.E) {
                        if ((rownode + 1) <= gridSize) {
                            nodebuilder(rownode + 1, colnode).addClass('protected');
                        }
                    }
                    if (Checkp.W) {
                        if ((rownode - 1) >= 0) {
                            nodebuilder(rownode - 1, colnode).addClass('protected');
                        }
                    }
                }
                if (Checkp.Checkpoint == 1 || Checkp.Checkpoint==2)
                    nodebuilder(rownode, colnode).addClass('protected');
            }
        }
    }
   

    //Spawn Radius
    function SpawnRadius(addRadius, X, Y, radius, Rclass) {
        //-1 offset to account for 0 base
        for (var Xradius = (X - radius - 1) ; Xradius < (X + radius) ; Xradius++) {
            for (var Yradius = (Y - radius - 1) ; Yradius < (Y + radius) ; Yradius++) {
                //check X and Y is in bounds
                if (Xradius >= 0 && Xradius <= 15 && Yradius >= 0 && Yradius <= 15) {
                    if (addRadius) {
                        nodebuilder(Xradius, Yradius).addClass(Rclass);
                    }
                    else {
                        nodebuilder(Xradius, Yradius).removeClass(Rclass);
                    }
                }
            }
        }
    }    

    $('#delete_dungeon').click(function(e) {
        e.preventDefault();
        if (dungeonObj != null) {
            if (confirm('!!!WARNING!!!\nAre you sure you want to remove ' + dungeonObj.Name+ ' ('+dungeonObj.TemplateId+')?\n' +
                'Change will be saved out to game files!')) {
                var postUrl = './Home/DeleteDungeon';
                var prevDungeonId = dungeonObj.TemplateId;
                $.post(postUrl, { dungeonid: prevDungeonId }).done(function(data) {
                    selectedNode = null;
                    dungeonJSON = JSON.parse(data);
                    $('#dungeonselect option[value=\'' + prevDungeonId + '\']').remove();
                    Load();
                    $(startingTile).trigger('click');
                }).fail(function(data) {
                    message(data.responseText, false);
                });
            }
        } else {
            message('Error trying to delete dungeon!', false);
        }
    });

    //Temp Auth Stuff
    $('#confirm_publish').click(function (e) {
        e.preventDefault();
        Save(true);        
    });

    //Temp Auth Stuff
    $('#auth_newdungeon, #auth_copydungeon').click(function (e) {
        e.preventDefault();
        var username = $('#new_auth_username').val(),
        password = $('#new_auth_password').val(),
        button = $(this);
        $.get('./Home/DungeonMaster', { user: username, pass: password }).done(function (data) {
            if (data == "ok") {
                $('#newDungeonModal').modal('toggle');
                if (button.attr('id') == "auth_newdungeon") {
                    NewDungeonSave();
                }
                else if (button.attr('id') == "auth_copydungeon") {
                    CopyDungeonSave();
                }                
            } else {
                message('Could not authorize, Try Again', false);
            }
        });
        $('#new_auth_username').val('');
        $('#new_auth_password').val('');
    });

    $('#sendcommand').click(function (e) {
        e.preventDefault();
        var cmd = $('#server_command').val(),
            sid = $('#server_command_serverid').val();
        cmd = $.trim(cmd);

        if(cmd == "") {
            message('You must enter a command before hitting submit', false);
            return;
        }

        var postUrl = './Home/ServerCommand';        
        $.post(postUrl, { command: cmd, serverid: sid }).done(function (data) {            
            if (data == 'Success') {
                message('Command Sent', true);
                ClearCommand();
            }
        }).fail(function (data) {
            message(data.responseText, false);
        });
    });

    $('#clearcommand').click(function () {
        ClearCommand();
    });

    function ClearCommand()
    {
        $('#server_command').val('');
        $('#server_command_serverid').val(0);
        $('#server_commands').val('');
        $('#server_command').focus();
    }

    function SetNav(anode, x, y) {
        ResetNav();
        var d_x = x + 1,
            d_y = y + 1;

        $('#tile_x').text(d_x);
        $('#tile_y').text(d_y);
        $('#tile_name').val(anode.Name);
        if(anode.Name)
            $('#header_tile_name').text(anode.Name + ' [' + d_x + ',' + d_y + ']');
        $('#tile_north').prop('checked', anode.N);
        $('#tile_south').prop('checked', anode.S);
        $('#tile_east').prop('checked', anode.E);
        $('#tile_west').prop('checked', anode.W);
        if (
            $('#tile_north').is(':checked') &&
            $('#tile_south').is(':checked') &&
            $('#tile_east').is(':checked') &&
            $('#tile_west').is(':checked')
        ) {
            $('#tile_all').prop('checked', true);
        } else {
            $('#tile_all').prop('checked', false);
        }

        $('#portal_source_dungeonid').val(dungeonObj.TemplateId);
        $('#portal_source_node_x').val(d_x);
        $('#portal_source_node_y').val(d_y);
        $('#portal_source_dungeonid').trigger('click');

        //Spawn Wander Distance Default
        $('#spawn_maxwander_distance').val(2);
        
        //Stop Nav on borders
        $('#tile_north').prop('disabled', (y === gridSize));
        $('#tile_south').prop('disabled', (y === 0));
        $('#tile_east').prop('disabled', (x === gridSize));
        $('#tile_west').prop('disabled', (x === 0));
        $('#addportal, #new_dungeon_save').prop('disabled', false);
        $('#maptype').val(anode.Map);
        $('#weathertype').val(anode.Weather);
        var weatheroption = $('#weathertype option').eq(anode.Weather).text();
        $('#tile_weather').prop('class',weatheroption);
        $('#point_type').val(anode.Checkpoint);
        $('#tile_treasureroom').prop('checked', anode.TreasureRoom);
        var checkpoint = anode.Checkpoint != 0;

        $('#checkpoint-list .selected').removeClass('selected');
        if (checkpoint == true) {
            var selectorId = '#cgo_r' + x + 'c' + y;
            $(selectorId).addClass('selected');
        }
        
        $('#portal_type').val(anode.DefaultPortalType);
        var portal = anode.Portal;

        $('#portal-list .btn').removeClass('selected');
        if (anode.IsPortal && portal != null) {            
            $('#deleteportal').prop('disabled', false);
            $('#portal_target_dungeonid').val(portal.TargetDungeonId);
            $('#portal_target_dungeonid').trigger('change');
            $('#portal_target_node_x').val(portal.TargetNodeX + 1);
            $('#portal_target_node_y').val(portal.TargetNodeY + 1);
            var selectorId = '#sgo_r' + x + 'c' + y;
            $(selectorId).addClass('selected');
            $('#NodePortals').slideDown();
        } else {
            if (!$('#pinPortals').prop('checked')) {
                $('#NodePortals').slideUp();
            }
        }
        $('#portal_target_dungeonid').trigger('change');
        var spawn = anode.Spawn;

        $('#SpawnList .selected').removeClass('selected');
        if (spawn != null) {
            $('#spawn_is_disabled').prop('checked', spawn.isDisabled);
            $('#spawn_factiontype').val(spawn.Faction);
            $('#spawn_fighteraitype').val(spawn.AiType);
            $('#spawn_maxwander_distance').val(spawn.MaxWanderDistance);
            $('#spawn_leadername_override').val(spawn.LeaderNameOverride);
            $('#spawn_leaderrace').val(spawn.LeaderRaceOverride);
            $('#spawn_leadertype').val(spawn.LeaderTypeOverride);
            $('#spawn_minionname_override').val(spawn.MinionNameOverride);
            $('#spawn_minionrace').val(spawn.MinionRaceOverride);
            $('#delete_spawnpoint').prop('disabled', false);
            $('#spawn_leadergender').val(spawn.LeaderSexOverride);
            $('#spawn_miniongender').val(spawn.MinionSexOverride);
            $('#spawn_kill_title').val(spawn.OnKillTitle);
            $('#spawn_kill_gatekey').val(spawn.OnKillGateKey);
            SpawnRadius(false, 9, 9, 15, "radius"); //wipe pre-existing spawn highlights
            SpawnRadius(true, d_x, d_y, spawn.MaxWanderDistance, "radius");
            $('#SpawnPoints').slideDown();
            var selectorId = '#cgo_r' + x + 'c' + y;
            $(selectorId).addClass('selected');
        } else {
            SpawnRadius(false, 9, 9, 15, "radius");
            if (!$('#pinSpawnPanel').prop('checked')) {
                $('#SpawnPoints').slideUp();
            }
        }
    }

    function ResetNav() {
        $('#tile_x').text('');
        $('#tile_y').text('');
        $('#tile_name').val('');
        $('#header_tile_name').text('');
        $('#tile_north').prop('checked', false);
        $('#tile_south').prop('checked', false);
        $('#tile_east').prop('checked', false);
        $('#tile_west').prop('checked', false);
        $('#tile_all').prop('checked', false);
        $('#maptype').val(0);
        $('#weathertype').val(0);        
        $('#point_type').val(0);
        $('#tile_treasureroom').prop('checked', false);
        $('#portal_target_dungeonid').val('');
        $('#portal_target_node_x').val('');
        $('#portal_target_node_y').val('');
        $('#portal_source_dungeonid').val('');
        $('#portal_source_node_x').val('');
        $('#portal_source_node_y').val('');
        $('#portal_type').val(1);
        $('#deleteportal').prop('disabled', true);
        $('#spawn_is_disabled').prop('checked', false);
        $('#spawn_factiontype').val(0);
        $('#spawn_fighteraitype').val(0);
        $('#spawn_maxwander_distance').val(0);
        $('#spawn_leadername_override').val('');
        $('#spawn_leaderrace').val(0);
        $('#spawn_leadertype').val(0);
        $('#spawn_minionname_override').val('');
        $('#spawn_minionrace').val(0);
        $('#delete_spawnpoint').prop('disabled', true);        
        $('#spawn_leadergender').val(0);
        $('#spawn_miniongender').val(0);
        $('#spawn_kill_title').val('');
        $('#spawn_kill_gatekey').val('');
    }

    function ResetTileClass(tile) {
        tile.removeClass();
        return tile;
    }

    function NewDungeonSave() {
        NewDungeon('./Home/NewDungeon');        
    }

    function CopyDungeonSave() {
        NewDungeon('./Home/CopyDungeon');        
    }

    function NewDungeon(postUrl)
    {
        if (selectedNode != null && dungeonObj != null) {
            if (confirm('Do you want to create a portal here and create this dungeon?')) {                
                $.post(postUrl, { dungeon: dungeonObj, nodeX: selectedNode.x, nodeY: selectedNode.y }).done(function (data) {
                    selectedNode = null;
                    dungeonJSON = JSON.parse(data);
                    $('#dungeonselect').append($('<option></option>')
                        .attr('value', dungeonJSON.TemplateId)
                        .text(dungeonJSON.TemplateId + ' - ' + dungeonJSON.Name)
                        .prop('selected', true));
                    Load();
                    $(startingTile).trigger('click');
                }).fail(function (data) {
                    message(data.responseText, false);
                });
            }

        } else {
            message('Error creating dungeon. Selected Node', false);
        }
    }

    function Load() {
        if (dungeonJSON !== 'undefined') {
            dungeonObj = dungeonJSON;
            tileNodes = [];
            
            $('#dungeon_name').val(dungeonObj.Name);
            $('#header_name').text(dungeonObj.Name);
            $('#dungeon_id').val(dungeonObj.TemplateId);
            $('#dungeon_level').val(dungeonObj.Level);
            $('#is_locked').prop('checked', dungeonObj.IsLocked);            
            $('#is_startingdungeon').prop('checked', dungeonObj.IsStartingDungeon);
            $('#is_quicktravel').prop('checked', dungeonObj.AlwaysQuickTravel);
            $('#WhiteList').val(dungeonObj.AccessWhitelist);
            $('#GuildWhiteList').val(dungeonObj.GuildWhitelist);
            $('#author_id').val(dungeonObj.Author);
            $('#notes').val(dungeonObj.Notes);
            $('#dungeon_region').val(dungeonObj.Region);
            $('#dungeon_requiredgatekey').val(dungeonObj.RequiredGateKey);
            //Events
            $('#event_xp').prop('checked', dungeonObj.EventXpBonus);
            $('#event_loot').prop('checked', dungeonObj.EventLootBonus);
            $('#event_guild').prop('checked', dungeonObj.EventGuildBonus);
            //Clear Portals
            $('#portal-list').empty();
            //Clear Checkpoints
            $('#checkpoint-list').empty();
            //PVP Arena
            $('#pvp_Arena_Level').val(dungeonObj.ArenaMode);
            //World Coordinates
            $('#dungeon_map_x').val(dungeonObj.MapX);
            $('#dungeon_map_y').val(dungeonObj.MapY);

            if (dungeonObj.IsLocked)
                $('#WhiteListContainer').show();
            else
                $('#WhiteListContainer').hide();

            $('#TileNames').html("");
            $('#SpawnList').html("");
            //stats/{1}
            var dungeonReport = $('#dungeon_report').prop('href');
            var subDungeonRef = dungeonReport.substr(dungeonReport.length - 5);            
            $('#dungeon_report').prop('href', dungeonReport.replace(subDungeonRef, dungeonObj.TemplateId));
            $('#dungeon_report').text(function(){
                return $(this).text().replace(subDungeonRef, dungeonObj.TemplateId);
            });
            
            for (var rownode = gridSize; rownode >= 0; rownode--) {
                var n = dungeonObj.Nodes[rownode];
                for (var colnode = 0; colnode < n.length; colnode++) {
                    var node = n[colnode],
                        $nodeid = nodebuilder(rownode,colnode);

                    //Grid Helper
                    ResetTileClass($nodeid);
                    $nodeid.addClass('grid-tile north south east west');
                    var mapoption = $('#maptype option[value='+node.Map+']').text();
                    $nodeid.addClass(mapoption);
                    
                    if (node.Weather === 0) {
                        node.Weather = 1;
                    }
                    if (node.Name == null) {
                        node.Name = "New Tile";                        
                    }
                    if (node.Weather === 1) {
                        $nodeid.addClass('normal');
                    }
                    if (node.Weather === 2) {
                        $nodeid.addClass('wet');
                    }
                    if (node.Weather === 3) {
                        $nodeid.addClass('cold');
                    }
                    if (node.Weather === 4) {
                        $nodeid.addClass('battle');
                    }
                    if (node.TreasureRoom) {
                        $nodeid.addClass('treasure');
                    }
                    //Tile Names list  - ommits hermits
                    if (node.N || node.S || node.W || node.E) {
                        var sgo = 'sgo_r' + rownode + 'c' + colnode;
                        $('#TileNames').append('<div class="panel-row col-md-12">' +
                            '<p class="col-md-9">' + node.Name + '</p>' +
                            '<input id="' + sgo + '" class="col-md-3 btn btn-default" type="button" value="[' +
                            (parseInt(rownode) + 1) + ',' + (parseInt(colnode) + 1) + ']" />' +
                            '</div>');

                        (function (node, sgo) {
                            $('#' + sgo).click(function () {
                                node.trigger('click');
                                $("html, body").animate({
                                    scrollTop: 0
                                }, 200);
                            });
                        })($nodeid, sgo);
                    }
                    if (node.IsPortal) {
                        $nodeid.addClass('portal');                        
                        var $plist = $('#portal-list'),
                            pgo = 'pgo_r'+rownode+'c'+colnode,
                            sgo = 'sgo_r' + rownode + 'c' + colnode;

                        var dungeonName = "";
                        var dungeonOptionByID = "#dungeonselect option[value='" + node.Portal.TargetDungeonId + "']";
                        dungeonName = $(dungeonOptionByID).text().split(' - ')[1];
                        dungeonName = dungeonName.replace('(locked)','');
                        $plist.append('<div class="panel-row col-md-12">' +
                            '<input id="' + pgo + '" class="col-md-9 btn btn-default" type="button" value="(' + node.Portal.TargetDungeonId + ') '+dungeonName+'" />' +
                            '<input id="' + sgo + '" class="col-md-3 btn btn-default" type="button" value="[' + (rownode + 1) + ',' + (colnode + 1) + ']" />' +
                            '</div>');
                        
                        (function (node, pgo, sgo, anode) {

                            var portal = anode.Portal;
                            var $pnode = nodebuilder(portal.TargetNodeX, portal.TargetNodeY);
                            
                            $('#' + pgo).click(function () {
                                selectedNode = null;
                                ResetNav();
                                $.post('./Home/SelectDungeon', { id: portal.TargetDungeonId }, function (data) {
                                    dungeonJSON = JSON.parse(data);
                                    Load();
                                    $pnode.trigger('click');
                                    $('#dungeonselect option:contains(\"' + portal.TargetDungeonId + '\")')
                                        .prop('selected', true);
                                    $pnode.addClass('dest');
                                });
                            });
                            $('#' + sgo).click(function () {
                                node.trigger('click');
                                $("html, body").animate({
                                    scrollTop: 0
                                }, 200);
                            });
                        })($nodeid, pgo, sgo, node);
                    } 
                    if (node.Checkpoint != 0) {
                        var $checkType = "";
                        if (node.Checkpoint == 1) {
                            $nodeid.addClass('checkpoint');
                            $nodeid.removeClass('respawn');
                            $checkType = "checkpoint";
                        }
                        if (node.Checkpoint == 2) {
                            $nodeid.addClass('respawn');
                            $nodeid.removeClass('checkpoint');
                            $checkType = "respawn";
                        }
                        var $clist = $('#checkpoint-list'),
                             cgo = 'cgo_r'+rownode+'c'+colnode;
                        $clist.append('<div class="panel-row col-md-12">'+
                            '<p class="col-xs-3 col-md-3">[' + (rownode + 1) + ',' + (colnode + 1) + ']</p>' +
                            '<p class="col-xs-5 col-md-5">'+$checkType+'</p>' +
                            '<input id="' + cgo + '" class="col-md-4 col-xs-4 btn btn-default" type="button" value="Select" /></div>');

                        (function (node, cgo) {
                            $('#' + cgo).click(function () {
                                node.trigger('click');
                                $("html, body").animate({
                                    scrollTop: 0
                                }, 200);
                            });
                        })($nodeid, cgo);
                    }


                    if (!node.N) {
                        $nodeid.removeClass('north');
                    }
                    if (!node.S) {
                        $nodeid.removeClass('south');
                    }
                    if (!node.E) {
                        $nodeid.removeClass('east');
                    }
                    if (!node.W) {
                        $nodeid.removeClass('west');
                    }
                    if (node.Spawn != null) {
                        $nodeid.addClass('spawn');

                        //output spawn list
                        var $clist = $('#SpawnList'),
                             cgo = 'cgo_r' + rownode + 'c' + colnode;

                        var spawnAI = function(ai) {
                            switch (ai) {
                                case 1:
                                    return "Minion";
                                case 2:
                                    return "Officer";
                                case 3:
                                    return "Leader";
                                case 4:
                                    return "Deity";
                                default:
                                    return "unknown";
                            }                            
                        }                        

                        var factionName = "";
                        var factionNameByID = "#spawn_factiontype option[value='" + node.Spawn.Faction + "']";
                        factionName = $(factionNameByID).text();

                        $clist.append('<div class="panel-row col-md-12">' +
                            '<p class="col-md-6">' + factionName +'</p>' +
                            '<p class="col-md-3">' + spawnAI(node.Spawn.AiType) + '</p>' +
                            '<input id="' + cgo + '" class="col-md-3 btn btn-default" type="button" value="[' + (rownode + 1) + ',' + (colnode + 1) + ']" /></div>');
                        (function (node, cgo) {
                            $('#' + cgo).click(function () {
                                node.trigger('click');
                                $("html, body").animate({
                                    scrollTop: 0
                                }, 200);
                            });
                        })($nodeid, cgo);
                    }
                    
                    //Hovers
                    $nodeid.attr('data-toggle', 'tooltip').
                        attr('data-placement', 'right').
                        attr('title', node.Name + ' [' + (rownode + 1) + ',' + (colnode + 1) + ']');                    

                    (function (node, x, y) {
                        $($nodeid).off('click').click(function (e) {
                            e.preventDefault();
                            if (selectedNode != null) {
                                SaveRoom(selectedNode);
                                selectedNode.removeClass('active');
                            }
                            var $selnode = $(this);
                            SetNav(node, x, y);
                            selectedNode = $selnode;
                            selectedNode.addClass('active');
                            selectedNode.x = x;
                            selectedNode.y = y;
                        });
                    })(node, (rownode), (colnode));

                    tileNodes.push([$nodeid,rownode,colnode]);
                }
            }
            HighlightAllSpawns();
            HighlightProtectedAreas();
            //Select Node
            $(selectedNode).trigger('click');

            return dungeonObj;
        }
    }

    function SaveRoom(node) {
        if (dungeonObj !== 'undefined') {
            var tile = dungeonObj.Nodes[node.x][node.y];
            tile.E = $('#tile_east').prop('checked');
            //tile.IsCheckpoint = $('#is_checkpoint').prop('checked');
            tile.Checkpoint = $('#point_type').val();
            tile.TreasureRoom = $('#tile_treasureroom').prop('checked');
            tile.Map = $('#maptype').val();
            tile.N = $('#tile_north').prop('checked');
            tile.Name = $('#tile_name').val();
            tile.S = $('#tile_south').prop('checked');
            tile.W = $('#tile_west').prop('checked');
            tile.Weather = $('#weathertype').val();
            tile.DefaultPortalType = $('#portal_type').val();                                   
        }
    }
    
    function Save(publish) {
        if (dungeonObj !== 'undefined') {
            if (confirm('Are you sure you want to save this dungeon?')) {
                SaveRoom(selectedNode);
                dungeonObj.Name = $('#dungeon_name').val();
                dungeonObj.TemplateId = $('#dungeon_id').val();
                dungeonObj.Level = $('#dungeon_level').val();
                dungeonObj.IsLocked = $('#is_locked').prop('checked');
                dungeonObj.AlwaysQuickTravel = $('#is_quicktravel').prop('checked');
                dungeonObj.IsStartingDungeon = $('#is_startingdungeon').prop('checked');
                dungeonObj.AccessWhitelist = $('#WhiteList').val();
                dungeonObj.GuildWhitelist = $('#GuildWhiteList').val();
                dungeonObj.Author = $('#author_id').val();
                dungeonObj.Notes = $('#notes').val();
                dungeonObj.Region = $('#dungeon_region').val();
                dungeonObj.EventXpBonus = $('#event_xp').prop('checked');
                dungeonObj.EventLootBonus = $('#event_loot').prop('checked');
                dungeonObj.EventGuildBonus = $('#event_guild').prop('checked');
                dungeonObj.RequiredGateKey = $('#dungeon_requiredgatekey').val();
                dungeonObj.ArenaMode = $('#pvp_Arena_Level').val();
                dungeonObj.MapX = $('#dungeon_map_x').val();
                dungeonObj.MapY = $('#dungeon_map_y').val();
                
                
                $('#dungeonselect option:contains(\"' + dungeonObj.TemplateId + '\")')
                    .text(dungeonJSON.TemplateId + ' - ' + dungeonJSON.Name)
                            .prop('selected', true);

                var postUrl = './Home/SaveDungeon';
                //Ajax required for strict datatype
                $.ajax({
                    url: postUrl,
                    type: 'post',
                    dataType: 'json',
                    data: dungeonObj,
                    success: function(data) {
                        if (publish) {
                            $.get('./Home/Publish', function(pub) {
                                message('Publish Complete!', true);
                            });
                        } else {
                            message('Save Complete', true);
                        }
                        dungeonJSON = data; //dont parse
                        Load();
                    },
                    error: function (data) {
                        message(data.responseText, false);
                    }
                });
            } 
        }
    }

    // CSV Generator - This is still a work in progress
    $('#generatecsv').click(function () {
        SaveAsCSV();
    });
    function SaveAsCSV() {
        var i = 0,
            dataString;
        dungeonCSV[0] = "ID, Name, Region, Locked, lvl, Author";
        $('#dungeonselect > option').each(function (e) {
            var d_select = $(this).val();
            var postUrl = './Home/SelectDungeon';
            $.post(postUrl, { id: d_select }, function (data) {
                i++;
                var CSVdungeonJSON;
                CSVdungeonJSON = JSON.parse(data);
                dungeonCSV[i] = d_select +
                    "," +
                    CSVdungeonJSON.Name +
                    "," +
                    CSVdungeonJSON.Region +
                    "," +
                    CSVdungeonJSON.IsLocked +
                    "," +
                    CSVdungeonJSON.Level +
                    "," +
                    CSVdungeonJSON.Author;
            });
        });    
        //console.log(dungeonCSV);

        dungeonCSV.forEach(function (infoArray, index) {
            CSVData = dungeonCSV.join("\n");
        });


        $('#Export').prop("href", 'data:text/csv;charset=utf-8,' + encodeURIComponent(CSVData));
        $('#Export').prop("download", 'Dungeons.csv');        
        $('#Export').prop("style", '');        
    }
}());


