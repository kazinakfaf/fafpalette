var app = new Vue({
    el: '#app',
    data: {
        properties_expanded: false,
        preview: {
            search: true
        },
        theme: {
            properties : {
                displayName: "MyTheme",
                author: "KaziNak",
                compatibilityVersion: 1,
                themeVersion: 1,
            },
            colors: {
                accent: '#2b71d9',
                background: '#212121',
                color: '#DCDCDC',
                search: "#9b7634"
            },
            mods: {
                queue: true
            }
        },
        presets: window.fafpalette_presets,
    },


    mounted() {
        
    },


    watch: {

        'theme.colors' : {
            handler: function (val, oldVal) {
                document.querySelector('.app > .preview').style.setProperty("--background", this.theme.colors.background);
                document.querySelector('.app > .preview').style.setProperty("--accent", this.theme.colors.accent);
                document.querySelector('.app > .preview').style.setProperty("--color", this.theme.colors.color);
                document.querySelector('.app > .preview').style.setProperty("--search", this.theme.colors.search);
            },
            deep: true,
            
            immediate: true,
        }
    },


    methods: {

        setPreset (preset) {
            this.theme.colors.accent = preset.accent;
            this.theme.colors.background = preset.background;
            this.theme.colors.color = preset.color;
            this.theme.colors.search = preset.search;   
        },

        downloadPresets() {
            let zip = new JSZip();
            let prev_colors = Object.assign({}, this.theme.colors);
            for (const [name, preset] of Object.entries(this.presets)) {
                this.setPreset(preset);
                zip.file(`${name}/theme.properties`, this.file_theme_properties(name));
                zip.file(`${name}/style_extension.css`, this.file_style_extension_css());
            }
            zip.generateAsync({type:"blob"})
            .then(function(content) {
                saveAs(content, name + "all_preset_themes.zip");
            });
            this.setPreset(prev_colors);
        },

        download() {
            var name = this.theme.properties.displayName;
            let zip = new JSZip();
            zip.file(`${name}/theme.properties`, this.file_theme_properties());
            zip.file(`${name}/style_extension.css`, this.file_style_extension_css());
            zip.generateAsync({type:"blob"})
            .then(function(content) {
                saveAs(content, name + ".zip");
            });
        },


        file_theme_properties(name = this.theme.properties.displayName) {
            let p = this.theme.properties;
            return dedent(   
            `displayName=${name}
            author=${p.author}
            compatibilityVersion=${p.compatibilityVersion}
            themeVersion=${p.themeVersion}`)
        },


        file_style_extension_css() {
            let t = this.theme;
            return dedent(
            `.root {
                -fx-background: ${t.colors.background};
                -fx-base: ${t.colors.background};
                -fx-accent: ${t.colors.accent};
                -fx-hover-accent: derive(-fx-accent, 20%);
                -fx-light-text-color: ${t.colors.color};
                -fx-search: ${t.colors.search};
                -context-menu-color: -fx-background;
            }

            #playersInQueueLabel${t.mods.queue ? '' : 'OFF'} {
                -fx-text-fill: -fx-search;
            }

            /*
             * Bug Fix
             */
            .toggle-button.queue:hover {
                -fx-background-color:  derive(-fx-hover-accent, 30%);
            }
            
            .toggle-button.queue:selected:hover {
                -fx-background-color: -fx-hover-accent;
            }
            
            /*
             *    Start search button
             */

            .toggle-button.start-search {
                -fx-border-color: -fx-search;
            }

            .toggle-button.start-search:hover {
                -fx-background-color: derive(-fx-background, 20%);
            }

            .toggle-button.start-search:selected {
                -fx-background-color: -fx-search;
                -fx-text-fill: white;
            }

            .toggle-button.start-search:selected:hover {
                -fx-background-color: derive(-fx-search, 20%);
            }
            
            /*
             * Main menu hamburger
             */
            .main-menu-button > .arrow-button > .arrow {
                -fx-background-color: -fx-light-text-color;
            }
            `)
        }
    }

});
