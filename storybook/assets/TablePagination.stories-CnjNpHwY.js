import{T as P}from"./TablePagination-BX_aERvc.js";import"./iframe-BbcE2xlx.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-CIe7dQFw.js";import"./index-ZzVPtAx9.js";import"./Select-D9V8r1Fr.js";import"./Dialog-B9_WImI3.js";import"./Button-DnPV7_mY.js";import"./utils-ocis19_-.js";import"./Label-D2G3L1-3.js";import"./Hidden-C93haUqf.js";import"./useFocusRing-BC3CU45L.js";import"./openLink-20IyJpTm.js";import"./useLabel-CQKww-_H.js";import"./useLabels-CujUkaDD.js";import"./number-Cc3QokmH.js";import"./I18nProvider-BegBiu4N.js";import"./useButton-ZlEi-6yE.js";import"./usePress-DtswbC_b.js";import"./textSelection-B8oU_1Mk.js";import"./useHover-BNwmytfM.js";import"./Heading-DPoU5OwX.js";import"./useOverlayTriggerState-fnJFULmm.js";import"./useControlledState-Dg1vtvcy.js";import"./useCollection-NSvCgj8X.js";import"./keyboard-nIto6CaS.js";import"./FocusScope-BOA7K9BB.js";import"./useEvent-CeJoJXAi.js";import"./Autocomplete-CRaLzT7p.js";import"./useLocalizedStringFormatter-DKd8MKcv.js";import"./getItemCount-DW24FxWn.js";import"./Text-Ct72wDGY.js";import"./VisuallyHidden-CVH6KHm9.js";import"./animation-yz14Wxhy.js";import"./FieldError-a4TAvjwk.js";import"./useFormValidation-C73d-4DM.js";import"./ListBox-6PM2O9TC.js";import"./useListState-FjoSCPHG.js";import"./useField-CmNAkUOo.js";import"./useFormReset-BCUUyuGy.js";import"./definition-l_O6Nzes.js";import"./Input-lAfVrzWc.js";import"./SearchField-CT1OoxxA.js";import"./useTextField-sumrhilM.js";import"./useFilter-Cuj2kv6t.js";import"./FieldLabel-Bq1Ga3h2.js";import"./FieldError-DfcOFlzM.js";import"./Text-CajzVDHZ.js";import"./ButtonIcon-Dq5XJmUp.js";const p=()=>{},me={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:m,pageSize:g,totalCount:c})=>{const u=Math.floor((m??0)/g)+1,l=Math.ceil((c??0)/g);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
