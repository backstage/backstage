import{T as P}from"./TablePagination-D7TD3M6c.js";import"./iframe-7sCYbwMA.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-B-PPvPC_.js";import"./index-DXJUlwCm.js";import"./Select-iqhIk3ej.js";import"./BUIRoutingProvider-DiU1oZiY.js";import"./useFocusRing-DtQAi71R.js";import"./Button-DGrW_YAy.js";import"./utils-9GxVsiDp.js";import"./Label-LRQoVPax.js";import"./Hidden-CI0OECmE.js";import"./useLabel-BFjYAAvj.js";import"./useLabels-BJlFaWLE.js";import"./number-D8Tvkt0y.js";import"./I18nProvider-CNZdU0-i.js";import"./useButton-Drv-lwD1.js";import"./usePress-CQso2Ktw.js";import"./textSelection-oDhLNlBr.js";import"./getMetaValue-BOiM-Q3U.js";import"./useHover-Bvne2y_8.js";import"./FieldError-D7hchg2Y.js";import"./Text-CuaSCD0n.js";import"./Form-DLTQ6Zj9.js";import"./useFormValidation-DK3qTci6.js";import"./ListBox-CRkY3W8z.js";import"./useCollection-BylKB84X.js";import"./keyboard-kxvRVjZ1.js";import"./FocusScope-Bn75Rqdl.js";import"./useEvent-DecXtKIc.js";import"./useControlledState-C8ScjM6r.js";import"./useLoadMoreSentinel-C4OgTpVn.js";import"./Autocomplete-M71SjeIb.js";import"./useLocalizedStringFormatter-BejVMsWK.js";import"./SelectionIndicator-CLAutkK-.js";import"./useListState-B2P8Ysr7.js";import"./Dialog-DQjsbsjj.js";import"./Heading-DEwrYAgS.js";import"./useOverlayTriggerState-nkxvKS82.js";import"./VisuallyHidden-BbBCn6_h.js";import"./animation-CpHqW5GJ.js";import"./useField-BPHR2NpW.js";import"./useFormReset-CeH0vvgE.js";import"./Input-BK9q61TK.js";import"./SearchField-BO2oypE5.js";import"./useTextField-VNmKoJ-w.js";import"./useFilter-B75V2q3l.js";import"./useCollectionAdapter-CFIAQO5T.js";import"./Avatar-wUooklHK.js";import"./Skeleton-BjHeuGbe.js";import"./FieldLabel-DJYYO_oG.js";import"./FieldError-CIpuouNF.js";import"./Popover-BWgdD84O.js";import"./Text-zdsrOI4J.js";import"./ButtonIcon-BF7HTXom.js";const p=()=>{},de={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:g,pageSize:m,totalCount:c})=>{const u=Math.floor((g??0)/m)+1,l=Math.ceil((c??0)/m);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
