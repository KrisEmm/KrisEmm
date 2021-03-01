module.exports = {
    LastestProject: function () {
        this.name = ""
        this.description = ""
        this.image_url = ""
        this.technologies = []
        this.languages = []
        this.code_url = ""
        this.status = ""
    },
    LastestRepos: function () {
        this.name = ""
        this.technologies = []
        this.languages = []
        this.code_url = ""
        this.status = ""
    },
    Project: function () {
        this.id = ""
        this.type = ""
        this.registeredAt = ""
        this.name = ""
        this.description = ""
        this.image_url = ""
        this.technologies = []
        this.languages = []
        this.code_url = ""
        this.status = ""
        this.repos_related = [
            {
                name: "",
                url: ""
            }
        ]
        this.requirements = []
        this.install = ""
        this.run = ""
    },
    Exercise: function () {
        this.id = ""
        this.type = ""
        this.registeredAt = ""
        this.name = ""
        this.description = ""
        this.image_url = ""
        this.technologies = []
        this.languages = []
        this.code_url = ""
        this.status = ""
        this.repos_related = {
            name: "",
            url: ""
        }
        this.reference = {
            source: "",
            url: ""
        }
        this.requirements = []
        this.install = ""
        this.run = ""
    }
}