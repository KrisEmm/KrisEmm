module.exports = {
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
        this.install = []
        this.run = []
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
        this.repos_related = [
            {
                name: "",
                url: ""
            }
        ]
        this.reference = {
            source: "",
            url: ""
        }
        this.requirements = []
        this.install = []
        this.run = []
    },
    Course: function () {
        this.id = ""
        this.name = ""
        this.company = ""
        this.image = ""
        this.url = ""
        this.certificate = ""
        this.duration = ""
        this.status = ""
    }
}