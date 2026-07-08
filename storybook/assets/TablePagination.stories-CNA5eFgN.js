import{T as P}from"./TablePagination-C9ssAq3f.js";import"./iframe-DUP7Kr9f.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-BVJl6YFP.js";import"./index-Dk7fxhAf.js";import"./Select-BQ3F4GBN.js";import"./Button-xMTzeFHr.js";import"./utils-OsyFBnTM.js";import"./Label-BWr9MvjN.js";import"./Hidden-DFXJQe4O.js";import"./useFocusRing-B1eaMwrg.js";import"./openLink-CpcL-pAy.js";import"./useLabel-9tsjfF-g.js";import"./useLabels-BZeNsKrn.js";import"./number-BPPv7Ioc.js";import"./I18nProvider-ByGA4yZu.js";import"./useButton-BpH5atl_.js";import"./usePress-CBZTJU3x.js";import"./textSelection-Dy2q-sAc.js";import"./useHover-D-kET7Yv.js";import"./FieldError-DN_xcTzW.js";import"./Text-CTeL5G12.js";import"./useFormValidation-wMuOtWAb.js";import"./ListBox-BG7j6RmA.js";import"./useCollection-BGt70NGl.js";import"./keyboard-wyu31WpW.js";import"./FocusScope-BOXiKyWz.js";import"./useEvent-HTZxTeYo.js";import"./useControlledState-DtDFdZyB.js";import"./getItemCount-c6AcdID-.js";import"./Autocomplete-UXx75M8g.js";import"./useLocalizedStringFormatter-BVbfSq6O.js";import"./useListState-DaHMSHEC.js";import"./Dialog-CbkhRwKg.js";import"./Heading-BuRbHD2O.js";import"./useOverlayTriggerState-BDxCsQwJ.js";import"./VisuallyHidden-C-qe1bQM.js";import"./animation-DvaI1_gU.js";import"./useField-CuB1pXJt.js";import"./useFormReset-BlbVtN_H.js";import"./Input-DwlhOTjU.js";import"./SearchField-D55vrjzY.js";import"./useTextField-LhEkeYiB.js";import"./useFilter-DKcqFvj2.js";import"./useCollectionAdapter-0otDuStS.js";import"./Avatar-C7lca5oB.js";import"./Skeleton-ChMgU4gA.js";import"./FieldLabel-DiwxL_hh.js";import"./FieldError-4a8m_uDv.js";import"./Popover-B1XEx6Ny.js";import"./Text-mBs9eAlr.js";import"./ButtonIcon-DOR-Ju1P.js";const p=()=>{},le={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:m,pageSize:g,totalCount:c})=>{const u=Math.floor((m??0)/g)+1,l=Math.ceil((c??0)/g);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
