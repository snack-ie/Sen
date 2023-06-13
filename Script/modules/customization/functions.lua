local sen_modules = {
    js_evaluate = {
        func_number = 1,
        include = {".js"},
        exclude = {},
        type = "file",
    },
    popcap_ptx_encode = {
        func_number = 2,
        include = {".png"},
        exclude = {},
        type = "file",
    },
    popcap_ptx_decode = {
        func_number = 3,
        include = {".ptx"},
        exclude = {},
        type = "file",
    },
    popcap_official_resources_split = {
        func_number = 4,
        include = {"resources.json"},
        exclude = {},
        type = "file",
    },
    popcap_official_resources_merge = {
        func_number = 5,
        include = {".res"},
        exclude = {},
        type = "directory",
    },
    popcap_official_to_unofficial = {
        func_number = 6,
        include = {"resources.json"},
        exclude = {},
        type = "file",
    },
    popcap_unofficial_to_official = {
        func_number = 7,
        include = {"res.json"},
        exclude = {},
        type = "file",
    },
    popcap_unofficial_resources_split = {
        func_number = 8,
        include = {"res.json"},
        exclude = {},
        type = "file",
    },
    popcap_unofficial_resources_merge = {
        func_number = 9,
        include = {".json.info"},
        exclude = {},
        type = "directory",
    },
    popcap_official_atlas_split = {
        -- This function can only be executed when you drag a png & json to tool
        func_number = 10,
        include = {},
        exclude = {},
        type = "unknown",
    },
    popcap_official_atlas_merge = {
        func_number = 11,
        include = {".sprite"},
        exclude = {},
        type = "directory",
    },
    popcap_unofficial_atlas_split = {
        -- This function can only be executed when you drag a png & json to tool
        func_number = 12,
        include = {},
        exclude = {},
        type = "unknown",
    },
    popcap_unofficial_atlas_merge = {
        func_number = 13,
        include = {".sprite"},
        exclude = {},
        type = "directory",
    },
    popcap_official_pam_to_pam_json = {
        func_number = 14,
        include = {".pam"},
        exclude = {".pam.json"},
        type = "file",
    },
    popcap_official_pam_json_to_pam = {
        func_number = 15,
        include = {".pam.json"},
        exclude = {".json"},
        type = "file",
    },
    popcap_rton_to_json = {
        func_number = 16,
        include = {".rton"},
        exclude = {},
        type = "file",
    },
    popcap_json_to_rton = {
        func_number = 17,
        include = {".json"},
        exclude = {".pam.json"},
        type = "file",
    },
    popcap_sprite_resize = {
        func_number = 18,
        include = {".sprite"},
        exclude = {},
        type = "directory",
    }
}
