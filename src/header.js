'use strict';

Vue.component('app-header', {
    props: {
        info: {
            type: String,
            required: true
        }
    },
    template: `
<nav class="navbar navbar-dark bg-dark justify-content-start">
    <a class="navbar-brand" href="#">
        <i class="fas fa-file-import" style="margin-right: 6px;"></i>TAG Excel Importer
    </a>
    <form class="form-inline my-2 my-lg-0">
        <label class="btn btn-primary mr-sm-2">
            <input type="file" id="browse-excel-file" @change="onFileChange" />
            <span>
                <i class="far fa-file-excel"></i>
                Browse Excel File...
            </span>
        </label>
        <button id="pipeline" type="button" name="pipeline" class="btn btn-primary mr-sm-2" @click="onPipeline">
            <span>
                <i class="fas fa-grip-lines-vertical"></i>
                Pipeline
            </span>
        </button>
        <button id="process" type="button" name="process" class="btn btn-primary mr-sm-2" @click="onProcess">
            <span>
                <i id="processing-icon" class="fas fa-microchip"></i>
                Process
            </span>
        </button>
        <button id="openGetEmpIdModal" type="button" name="openGetEmpIdModal" class="btn btn-primary mr-sm-2" @click="onOpenGetEmpIdModal">
            <span>
                <i class="fas fa-id-card"></i>
                Fetch Employee Ids
            </span>
        </button>
        <button id="btn-export-rules" type="button" name="btn-export-rules" class="btn btn-primary mr-sm-2" @click="onExportRules">
            <span>
                <i class="fas fa-share"></i>
                Export Rules
            </span>
        </button>
        <button id="btn-export-mappings" type="button" name="btn-export-mappings" class="btn btn-primary mr-sm-2" @click="onExportMappings">
            <span>
                <i class="fas fa-share"></i>
                Export Mappings
            </span>
        </button>
        <button id="btn-save-excel-file" type="button" name="btn-save-excel-file" class="btn btn-primary mr-sm-2" @click="onSaveExcel">
            <span>
                <i class="fas fa-file-download"></i>
                Save Excel File...
            </span>
        </button>
    </form>
    <span class="navbar-text">{{info}}</span>
</nav>
    `,
    data() {
        return {

        };
    },
    methods: {
        onFileChange(event) {
            const file = event.target.files[0];
            this.$emit('file-selected', file);
        },
        onPipeline() {
            this.$emit('pipeline');
        },
        onProcess() {
            this.$emit('process');
        },
        onOpenGetEmpIdModal() {
            this.$emit('open-get-emp-id');
        },
        onExportRules() {
            this.$emit('export-rules');
        },
        onExportMappings() {
            this.$emit('export-mappings');
        },
        onSaveExcel() {
            this.$emit('save-excel');
        }
    }
});
