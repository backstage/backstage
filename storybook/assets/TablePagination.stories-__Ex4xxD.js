import{T as P}from"./TablePagination-a2jEG0Wr.js";import"./iframe-BvJPDVBV.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-tDMEiP8o.js";import"./index-DlBhB-X9.js";import"./Select-BRi_uDc4.js";import"./Dialog-B5O227A_.js";import"./Button-D3GRHLY2.js";import"./utils-Z2mfoDLi.js";import"./Label-Dai2jtKU.js";import"./Hidden-DW6-0oV-.js";import"./useFocusRing-C44Kug38.js";import"./openLink-C9f1t9oF.js";import"./useLabel-mJoiZaAP.js";import"./useLabels-DD4p0Oc1.js";import"./number-CVSPJTca.js";import"./I18nProvider-BN_UnnaB.js";import"./useButton-BXsVf132.js";import"./usePress-CthXnzTg.js";import"./textSelection-DZfUw277.js";import"./useHover-CdFjvGbq.js";import"./Heading-DSRgEz2y.js";import"./useOverlayTriggerState-Chqi7_FQ.js";import"./useControlledState-BKLtykmo.js";import"./useCollection-Df4Oy7qC.js";import"./keyboard-BQxdBaVL.js";import"./FocusScope-Cn8zL3EE.js";import"./useEvent-CXJCrTg1.js";import"./Autocomplete-0zyo9vEk.js";import"./useLocalizedStringFormatter-DrqKOtjs.js";import"./getItemCount-DAVoeOfJ.js";import"./Text-bpKwXApE.js";import"./VisuallyHidden-DWmgbEvW.js";import"./animation-C2gzKxtB.js";import"./FieldError-C5h39g8q.js";import"./useFormValidation-Be_xoFFA.js";import"./ListBox-Hc9dpMOf.js";import"./useListState-Dqig79IW.js";import"./useField-Czz_v4cf.js";import"./useFormReset-DnYrvC4X.js";import"./definition-BCmODNNo.js";import"./Input-BF3XMKmy.js";import"./SearchField-D92z2tbS.js";import"./useTextField-BdWGVJZ4.js";import"./useFilter-CXg5yNy1.js";import"./FieldLabel-DbRs1BQd.js";import"./FieldError-CrH7yXFX.js";import"./Text-ChyOAmCq.js";import"./ButtonIcon-CrsBrA1w.js";const p=()=>{},me={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:m,pageSize:g,totalCount:c})=>{const u=Math.floor((m??0)/g)+1,l=Math.ceil((c??0)/g);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
