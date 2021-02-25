module.exports = {
    LastestProject: function () {
        this.name = ""
        this.description = ""
        this.image_url = ""
        this.technologies = []
        this.lenguages = []
        this.source_url = ""
        this.status = ""
    },
    LastestRepos: function () {
        this.name = ""
        this.technologies = []
        this.lenguages = []
        this.source_url = ""
        this.status = ""
    },
    Project: function () {
        this.id = ""
        this.registeredAt = ""
        this.name = ""
        this.description = ""
        this.image_url = ""
        this.technologies = []
        this.lenguages = []
        this.source_url = ""
        this.status = ""
        this.repos_related = {
            name: "",
            url: ""
        }
        this.requirements = []
        this.install = ""
        this.run = ""
    },
    Exercise: function () {
        this.id = ""
        this.registeredAt = ""
        this.name = ""
        this.description = ""
        this.image_url = ""
        this.technologies = []
        this.lenguages = []
        this.source_url = ""
        this.status = ""
        this.repos_related = {
            name: "",
            url: ""
        }
        this.type = ""
        this.reference = {
            type: "",
            url: ""
        }
        this.requirements = []
        this.install = ""
        this.run = ""
    }
}