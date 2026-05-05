import{T as P}from"./TablePagination-BpsVXyiF.js";import"./iframe-DWvOg1Nr.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-DrTl60C1.js";import"./index-S3ZOnYmL.js";import"./Select-DCuoQaH4.js";import"./Dialog-3Fl81PI4.js";import"./Button-c5Ss17fJ.js";import"./utils-DtKPZPYA.js";import"./Label-CaafuvKx.js";import"./Hidden-cMg_glYf.js";import"./useFocusRing-YnyZfhhs.js";import"./openLink-l0pO1O-P.js";import"./useLabel-Bai5AK5S.js";import"./useLabels-C3rwEQd8.js";import"./number-DzY8DBKT.js";import"./I18nProvider-CKpv70eZ.js";import"./useButton-BgtsHV1j.js";import"./usePress-CRFAjYPC.js";import"./textSelection-DpxUvBDH.js";import"./useHover-BBZSc4a-.js";import"./Heading-CieAxHPb.js";import"./useOverlayTriggerState-CWnmk84F.js";import"./useControlledState-C9nFpXLR.js";import"./useCollection-BlY4FFXa.js";import"./keyboard-DsYEEPu8.js";import"./FocusScope-BS0QMViL.js";import"./useEvent-br1AIljo.js";import"./Autocomplete--OHIbt3H.js";import"./useLocalizedStringFormatter-8YxUyZJo.js";import"./getItemCount-CZ-LHksj.js";import"./Text-D7tUisNB.js";import"./VisuallyHidden-LCJQ11OY.js";import"./animation-BMM9phCi.js";import"./FieldError-Cn4RMDH6.js";import"./useFormValidation-dqv5PRTh.js";import"./ListBox-DRUjBoJn.js";import"./useListState-DZJXhzOX.js";import"./useField-Cz8KgY5A.js";import"./useFormReset-CxVBRLBa.js";import"./definition-34tFyXtC.js";import"./Input-D_1Oh_cE.js";import"./SearchField-DgHch0mb.js";import"./useTextField-DD6tM4yt.js";import"./useFilter-C_Ppjfxt.js";import"./FieldLabel-XmD2Nl-X.js";import"./FieldError-CgRJrcBj.js";import"./Text-D5esK7bM.js";import"./ButtonIcon-DCL1JC7m.js";const p=()=>{},me={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:m,pageSize:g,totalCount:c})=>{const u=Math.floor((m??0)/g)+1,l=Math.ceil((c??0)/g);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  args: {
    offset: 0,
    pageSize: 10,
    totalCount: 100,
    hasNextPage: true,
    hasPreviousPage: false,
    onNextPage: noop,
    onPreviousPage: noop,
    onPageSizeChange: noop,
    showPageSizeOptions: true
  }
}`,...e.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args
  }
}`,...o.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    offset: 90,
    hasNextPage: false,
    hasPreviousPage: true
  }
}`,...a.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    offset: 40,
    hasPreviousPage: true
  }
}`,...r.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    showPageSizeOptions: false
  }
}`,...t.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    offset: undefined
  }
}`,...s.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    offset: 20,
    hasPreviousPage: true,
    getLabel: ({
      offset,
      pageSize,
      totalCount
    }) => {
      const page = Math.floor((offset ?? 0) / pageSize) + 1;
      const totalPages = Math.ceil((totalCount ?? 0) / pageSize);
      return \`Page \${page} of \${totalPages}\`;
    }
  }
}`,...n.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    totalCount: 0,
    hasNextPage: false
  }
}`,...i.parameters?.docs?.source}}};const ce=["Default","FirstPage","LastPage","MiddlePage","WithoutPageSizeOptions","CursorPagination","CustomLabel","EmptyState"];export{s as CursorPagination,n as CustomLabel,e as Default,i as EmptyState,o as FirstPage,a as LastPage,r as MiddlePage,t as WithoutPageSizeOptions,ce as __namedExportsOrder,me as default};
