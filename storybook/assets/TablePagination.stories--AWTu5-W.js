import{T as P}from"./TablePagination-B7JBgwTx.js";import"./iframe-BKMB85pu.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-CqnWYM4T.js";import"./index-CSiDGQP5.js";import"./Select-CUYyB-Fe.js";import"./BUIRoutingProvider-AZNaPzeL.js";import"./useFocusRing-jnagQyYL.js";import"./Button-BvAYTrV8.js";import"./utils-Nyu7VTFu.js";import"./Label-Y7OAC7uK.js";import"./Hidden-DHN5dLew.js";import"./useLabel-CeJz4BMW.js";import"./useLabels-CFKWkPDt.js";import"./number-CuQ36X_j.js";import"./I18nProvider-29Kr0hRB.js";import"./useButton-BR5xtNl4.js";import"./usePress-BpVHvCO3.js";import"./textSelection-Cj_b9rbF.js";import"./getMetaValue-TGQihhTK.js";import"./useHover-BaAG1-q2.js";import"./FieldError-DJK2D3AO.js";import"./Text-Dg9dYh63.js";import"./Form-BffRYw_3.js";import"./useFormValidation-B-ExQgbu.js";import"./ListBox-CW795u3y.js";import"./useCollection-DCkpMumb.js";import"./keyboard-D8lqn657.js";import"./FocusScope-BD1DX3z1.js";import"./useEvent-BEstD6-f.js";import"./useControlledState-D3rG0KvC.js";import"./useLoadMoreSentinel-fdP4gNAl.js";import"./Autocomplete-BlDpM6qn.js";import"./useLocalizedStringFormatter-ZPcyGWMD.js";import"./SelectionIndicator-DQYlZ420.js";import"./useListState-Dn5rbzz7.js";import"./Dialog-DEfmHw7Y.js";import"./Heading-b3FFWJ0-.js";import"./useOverlayTriggerState-BIOnmv4V.js";import"./VisuallyHidden-DlBkD_uH.js";import"./animation-R0urY-IW.js";import"./useField-D3sSVYZC.js";import"./useFormReset-CvckHHjx.js";import"./Input-wf8wPR2b.js";import"./SearchField-Dm1ghHg9.js";import"./useTextField-CKOhWsDF.js";import"./useFilter-DkO-TdTR.js";import"./useCollectionAdapter-CTFsuzOy.js";import"./Avatar-BCQIJA8I.js";import"./Skeleton-BrHGtgXJ.js";import"./FieldLabel-ByZa5k2N.js";import"./FieldError-Dt0oo7L_.js";import"./Popover-cWCFqkBm.js";import"./Text-HfhzKVIY.js";import"./ButtonIcon-DlomWlgb.js";const p=()=>{},de={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:g,pageSize:m,totalCount:c})=>{const u=Math.floor((g??0)/m)+1,l=Math.ceil((c??0)/m);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
}`,...i.parameters?.docs?.source}}};const he=["Default","FirstPage","LastPage","MiddlePage","WithoutPageSizeOptions","CursorPagination","CustomLabel","EmptyState"];export{s as CursorPagination,n as CustomLabel,e as Default,i as EmptyState,o as FirstPage,a as LastPage,r as MiddlePage,t as WithoutPageSizeOptions,he as __namedExportsOrder,de as default};
