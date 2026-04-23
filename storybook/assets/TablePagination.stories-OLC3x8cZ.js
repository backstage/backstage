import{T as P}from"./TablePagination-ClbAeNW-.js";import"./iframe-D4ojcRBn.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-DkO8wYK8.js";import"./index-wUV5n3Lj.js";import"./Select-B2iLoFOo.js";import"./Dialog-CJRFIS4q.js";import"./Button-DsW7Brbl.js";import"./utils-Cm3b7Skj.js";import"./Label-CB4WGRMe.js";import"./Hidden-DqoOPxZG.js";import"./useGlobalListeners-Gjlq1Nm8.js";import"./openLink-Dgpda5ne.js";import"./useLabel-Bpz-kngj.js";import"./useLabels-Bymz_Bk2.js";import"./number-BMwxkJ1f.js";import"./I18nProvider-DcSF5323.js";import"./useButton-Ds76GMuS.js";import"./usePress-C2Xo5NR5.js";import"./textSelection-D1kZvdOs.js";import"./useHover-BrnPNTQ_.js";import"./Heading-BNWcgXFS.js";import"./useOverlayTriggerState-KefCD6yL.js";import"./useControlledState-DLb6xbqZ.js";import"./useCollection-BOJ37AYD.js";import"./keyboard-CWbYtSBH.js";import"./FocusScope-CtR-NYVZ.js";import"./useEvent-Bo_Ag7Ze.js";import"./Autocomplete-ZvIpyd9g.js";import"./useLocalizedStringFormatter-CxWeQ8ll.js";import"./getItemCount-Bdc0HNtk.js";import"./Text-CeBFKxbr.js";import"./VisuallyHidden-ZFnIyy2e.js";import"./animation-BMMFchtM.js";import"./FieldError-D1tnYwiC.js";import"./useFormValidation-QY3_JajN.js";import"./ListBox-UjmNzPiw.js";import"./useListState-CLNtscvB.js";import"./useField-DTRRMUNK.js";import"./useFormReset-vk-N9tAs.js";import"./definition-Cdl3um0c.js";import"./Input-B3C67cIY.js";import"./SearchField-7oyAcyDD.js";import"./useTextField-DuhpfueG.js";import"./useFilter-DB-RcLD6.js";import"./FieldLabel-CI9K53U2.js";import"./FieldError-yJqEjFdo.js";import"./Text-CQr1Uda4.js";import"./ButtonIcon-CAsWed1t.js";const p=()=>{},me={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:m,pageSize:g,totalCount:c})=>{const u=Math.floor((m??0)/g)+1,l=Math.ceil((c??0)/g);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
