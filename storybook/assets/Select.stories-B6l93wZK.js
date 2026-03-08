import{j as m}from"./iframe-C7l5P2_I.js";import{S as l}from"./Select-BaI2YuA7.js";import"./preload-helper-PPVm8Dsz.js";import"./Cancel-cb8057xf.js";import"./makeStyles-DO0dhQTG.js";import"./createStyles-Bp4GwXob.js";import"./createStyles-yD3y8ldD.js";import"./Box-CnwfTMBK.js";import"./styled-BQ5_1fzN.js";import"./FormLabel-BduOcCS6.js";import"./formControlState-Cg625is9.js";import"./InputLabel-BzXMwAn9.js";import"./Select-DtfcHVIh.js";import"./index-B9sM2jn7.js";import"./Popover-B2wLjBT4.js";import"./Modal-irLIXdct.js";import"./Portal-YwRf0OFq.js";import"./List-C_Ju4KCi.js";import"./ListContext-Dobuofun.js";import"./MenuItem-wX1DH0fS.js";import"./ListItem-DkGdhH3Z.js";import"./Checkbox-Pj7D5a7g.js";import"./SwitchBase-B1krwLlg.js";import"./Chip-BF6e1TPJ.js";const L={title:"Inputs/Select",component:l,tags:["!manifest"]},o=[{label:"test 1",value:"test_1"},{label:"test 2",value:"test_2"},{label:"test 3",value:"test_3"}],s=()=>m.jsx(l,{onChange:()=>{},placeholder:"All results",label:"Default",items:o}),t=()=>m.jsx(l,{placeholder:"All results",label:"Multiple",items:o,multiple:!0,onChange:()=>{}}),e=i=>m.jsx(l,{...i});e.args={placeholder:"All results",label:"Disabled",items:o,disabled:!0};const r=i=>m.jsx(l,{...i});r.args={placeholder:"All results",label:"Selected",items:o,disabled:!1,selected:"test_2"};const n=i=>m.jsx(l,{...i});n.args={placeholder:"All results",label:"Native",items:o,disabled:!1,selected:"test_2",native:!0};const a=i=>m.jsx(l,{...i});a.args={placeholder:"All results",label:"Margin Dense",items:o,disabled:!1,selected:"test_2",margin:"dense"};s.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"Multiple"};e.__docgenInfo={description:"",methods:[],displayName:"Disabled",props:{multiple:{required:!1,tsType:{name:"boolean"},description:""},items:{required:!0,tsType:{name:"Array",elements:[{name:"signature",type:"object",raw:`{
  label: string;
  value: string | number;
}`,signature:{properties:[{key:"label",value:{name:"string",required:!0}},{key:"value",value:{name:"union",raw:"string | number",elements:[{name:"string"},{name:"number"}],required:!0}}]}}],raw:"SelectItem[]"},description:""},label:{required:!0,tsType:{name:"string"},description:""},placeholder:{required:!1,tsType:{name:"string"},description:""},selected:{required:!1,tsType:{name:"union",raw:"string | string[] | number | number[]",elements:[{name:"string"},{name:"Array",elements:[{name:"string"}],raw:"string[]"},{name:"number"},{name:"Array",elements:[{name:"number"}],raw:"number[]"}]},description:""},onChange:{required:!0,tsType:{name:"signature",type:"function",raw:"(arg: SelectedItems) => void",signature:{arguments:[{type:{name:"union",raw:"string | string[] | number | number[]",elements:[{name:"string"},{name:"Array",elements:[{name:"string"}],raw:"string[]"},{name:"number"},{name:"Array",elements:[{name:"number"}],raw:"number[]"}]},name:"arg"}],return:{name:"void"}}},description:""},triggerReset:{required:!1,tsType:{name:"boolean"},description:""},native:{required:!1,tsType:{name:"boolean"},description:""},disabled:{required:!1,tsType:{name:"boolean"},description:""},margin:{required:!1,tsType:{name:"union",raw:"'dense' | 'none'",elements:[{name:"literal",value:"'dense'"},{name:"literal",value:"'none'"}]},description:""},"data-testid":{required:!1,tsType:{name:"string"},description:""}}};r.__docgenInfo={description:"",methods:[],displayName:"Selected",props:{multiple:{required:!1,tsType:{name:"boolean"},description:""},items:{required:!0,tsType:{name:"Array",elements:[{name:"signature",type:"object",raw:`{
  label: string;
  value: string | number;
}`,signature:{properties:[{key:"label",value:{name:"string",required:!0}},{key:"value",value:{name:"union",raw:"string | number",elements:[{name:"string"},{name:"number"}],required:!0}}]}}],raw:"SelectItem[]"},description:""},label:{required:!0,tsType:{name:"string"},description:""},placeholder:{required:!1,tsType:{name:"string"},description:""},selected:{required:!1,tsType:{name:"union",raw:"string | string[] | number | number[]",elements:[{name:"string"},{name:"Array",elements:[{name:"string"}],raw:"string[]"},{name:"number"},{name:"Array",elements:[{name:"number"}],raw:"number[]"}]},description:""},onChange:{required:!0,tsType:{name:"signature",type:"function",raw:"(arg: SelectedItems) => void",signature:{arguments:[{type:{name:"union",raw:"string | string[] | number | number[]",elements:[{name:"string"},{name:"Array",elements:[{name:"string"}],raw:"string[]"},{name:"number"},{name:"Array",elements:[{name:"number"}],raw:"number[]"}]},name:"arg"}],return:{name:"void"}}},description:""},triggerReset:{required:!1,tsType:{name:"boolean"},description:""},native:{required:!1,tsType:{name:"boolean"},description:""},disabled:{required:!1,tsType:{name:"boolean"},description:""},margin:{required:!1,tsType:{name:"union",raw:"'dense' | 'none'",elements:[{name:"literal",value:"'dense'"},{name:"literal",value:"'none'"}]},description:""},"data-testid":{required:!1,tsType:{name:"string"},description:""}}};n.__docgenInfo={description:"",methods:[],displayName:"Native",props:{multiple:{required:!1,tsType:{name:"boolean"},description:""},items:{required:!0,tsType:{name:"Array",elements:[{name:"signature",type:"object",raw:`{
  label: string;
  value: string | number;
}`,signature:{properties:[{key:"label",value:{name:"string",required:!0}},{key:"value",value:{name:"union",raw:"string | number",elements:[{name:"string"},{name:"number"}],required:!0}}]}}],raw:"SelectItem[]"},description:""},label:{required:!0,tsType:{name:"string"},description:""},placeholder:{required:!1,tsType:{name:"string"},description:""},selected:{required:!1,tsType:{name:"union",raw:"string | string[] | number | number[]",elements:[{name:"string"},{name:"Array",elements:[{name:"string"}],raw:"string[]"},{name:"number"},{name:"Array",elements:[{name:"number"}],raw:"number[]"}]},description:""},onChange:{required:!0,tsType:{name:"signature",type:"function",raw:"(arg: SelectedItems) => void",signature:{arguments:[{type:{name:"union",raw:"string | string[] | number | number[]",elements:[{name:"string"},{name:"Array",elements:[{name:"string"}],raw:"string[]"},{name:"number"},{name:"Array",elements:[{name:"number"}],raw:"number[]"}]},name:"arg"}],return:{name:"void"}}},description:""},triggerReset:{required:!1,tsType:{name:"boolean"},description:""},native:{required:!1,tsType:{name:"boolean"},description:""},disabled:{required:!1,tsType:{name:"boolean"},description:""},margin:{required:!1,tsType:{name:"union",raw:"'dense' | 'none'",elements:[{name:"literal",value:"'dense'"},{name:"literal",value:"'none'"}]},description:""},"data-testid":{required:!1,tsType:{name:"string"},description:""}}};a.__docgenInfo={description:"",methods:[],displayName:"MarginDense",props:{multiple:{required:!1,tsType:{name:"boolean"},description:""},items:{required:!0,tsType:{name:"Array",elements:[{name:"signature",type:"object",raw:`{
  label: string;
  value: string | number;
}`,signature:{properties:[{key:"label",value:{name:"string",required:!0}},{key:"value",value:{name:"union",raw:"string | number",elements:[{name:"string"},{name:"number"}],required:!0}}]}}],raw:"SelectItem[]"},description:""},label:{required:!0,tsType:{name:"string"},description:""},placeholder:{required:!1,tsType:{name:"string"},description:""},selected:{required:!1,tsType:{name:"union",raw:"string | string[] | number | number[]",elements:[{name:"string"},{name:"Array",elements:[{name:"string"}],raw:"string[]"},{name:"number"},{name:"Array",elements:[{name:"number"}],raw:"number[]"}]},description:""},onChange:{required:!0,tsType:{name:"signature",type:"function",raw:"(arg: SelectedItems) => void",signature:{arguments:[{type:{name:"union",raw:"string | string[] | number | number[]",elements:[{name:"string"},{name:"Array",elements:[{name:"string"}],raw:"string[]"},{name:"number"},{name:"Array",elements:[{name:"number"}],raw:"number[]"}]},name:"arg"}],return:{name:"void"}}},description:""},triggerReset:{required:!1,tsType:{name:"boolean"},description:""},native:{required:!1,tsType:{name:"boolean"},description:""},disabled:{required:!1,tsType:{name:"boolean"},description:""},margin:{required:!1,tsType:{name:"union",raw:"'dense' | 'none'",elements:[{name:"literal",value:"'dense'"},{name:"literal",value:"'none'"}]},description:""},"data-testid":{required:!1,tsType:{name:"string"},description:""}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const Default = () => (
  <Select
    onChange={() => {}}
    placeholder="All results"
    label="Default"
    items={SELECT_ITEMS}
  />
);
`,...s.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{code:`const Multiple = () => (
  <Select
    placeholder="All results"
    label="Multiple"
    items={SELECT_ITEMS}
    multiple
    onChange={() => {}}
  />
);
`,...t.parameters?.docs?.source}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Disabled = () => (
  <Select
    placeholder="All results"
    label="Disabled"
    items={SELECT_ITEMS}
    disabled
  />
);
`,...e.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Selected = () => (
  <Select
    placeholder="All results"
    label="Selected"
    items={SELECT_ITEMS}
    disabled={false}
    selected="test_2"
  />
);
`,...r.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{code:`const Native = () => (
  <Select
    placeholder="All results"
    label="Native"
    items={SELECT_ITEMS}
    disabled={false}
    selected="test_2"
    native
  />
);
`,...n.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{code:`const MarginDense = () => (
  <Select
    placeholder="All results"
    label="Margin Dense"
    items={SELECT_ITEMS}
    disabled={false}
    selected="test_2"
    margin="dense"
  />
);
`,...a.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:'() => <Select onChange={() => {}} placeholder="All results" label="Default" items={SELECT_ITEMS} />',...s.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:'() => <Select placeholder="All results" label="Multiple" items={SELECT_ITEMS} multiple onChange={() => {}} />',...t.parameters?.docs?.source}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:"(args: SelectProps) => <Select {...args} />",...e.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:"(args: SelectProps) => <Select {...args} />",...r.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:"(args: SelectProps) => <Select {...args} />",...n.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:"(args: SelectProps) => <Select {...args} />",...a.parameters?.docs?.source}}};const k=["Default","Multiple","Disabled","Selected","Native","MarginDense"];export{s as Default,e as Disabled,a as MarginDense,t as Multiple,n as Native,r as Selected,k as __namedExportsOrder,L as default};
