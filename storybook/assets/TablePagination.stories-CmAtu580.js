import{T as P}from"./TablePagination-F7Bk9zjm.js";import"./iframe-A5q7KvPV.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-DI-R3VBW.js";import"./index-CmJXbCwW.js";import"./Select-BP06zXpu.js";import"./Button-XHM23BEd.js";import"./utils-Bd1To_cp.js";import"./Label-DE0NX8eg.js";import"./Hidden-CskdN9Ng.js";import"./useFocusRing-CPnrIyn1.js";import"./openLink-Cwj0uu6r.js";import"./useLabel-Dsw_IjC-.js";import"./useLabels-CVaxSMYD.js";import"./number-D5A5VP1m.js";import"./I18nProvider-BQn_nrLl.js";import"./useButton-CnerOY6g.js";import"./usePress-eozoWKZn.js";import"./textSelection-DBqj4_Js.js";import"./useHover-BuQfyXDT.js";import"./FieldError-CarArOa-.js";import"./Text-S0QT30oh.js";import"./useFormValidation-DEJ9EEyE.js";import"./ListBox-LHcXGeE0.js";import"./useCollection-d4liYNuA.js";import"./keyboard-owTSdexX.js";import"./FocusScope-DQc1fB9P.js";import"./useEvent-gKV9J6XA.js";import"./useControlledState-DL5QOA5t.js";import"./getItemCount-DSkr3rUA.js";import"./Autocomplete-Ot2MDEsQ.js";import"./useLocalizedStringFormatter-CJ3uu6qK.js";import"./useListState-C1r74yqQ.js";import"./Dialog-CZGKeKw-.js";import"./Heading-RIf1nfLa.js";import"./useOverlayTriggerState-RZwt8MjL.js";import"./VisuallyHidden-CrRt6UY6.js";import"./animation-Dikt5ULv.js";import"./useField-CE3-IKhf.js";import"./useFormReset-YQ3CTLA4.js";import"./Input-Dx-TcgvS.js";import"./SearchField-C078_e1N.js";import"./useTextField-CBLcHat9.js";import"./useFilter-ibFzBqBC.js";import"./useCollectionAdapter-BIRqnJyW.js";import"./Avatar-ElW_CYqN.js";import"./Skeleton-DcmG_LYJ.js";import"./FieldLabel-CusbnJc2.js";import"./FieldError-mGUiV3LW.js";import"./Popover-Djg3fEnZ.js";import"./Text-C5s-h8E-.js";import"./ButtonIcon-D9MJLpnb.js";const p=()=>{},le={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:m,pageSize:g,totalCount:c})=>{const u=Math.floor((m??0)/g)+1,l=Math.ceil((c??0)/g);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
}`,...i.parameters?.docs?.source}}};const Pe=["Default","FirstPage","LastPage","MiddlePage","WithoutPageSizeOptions","CursorPagination","CustomLabel","EmptyState"];export{s as CursorPagination,n as CustomLabel,e as Default,i as EmptyState,o as FirstPage,a as LastPage,r as MiddlePage,t as WithoutPageSizeOptions,Pe as __namedExportsOrder,le as default};
