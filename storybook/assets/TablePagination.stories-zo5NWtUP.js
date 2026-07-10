import{T as P}from"./TablePagination-CHgOrCax.js";import"./iframe-B-XWDeDQ.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-BjeGjbpr.js";import"./index-Bhxil5SO.js";import"./Select-DAuJzdf3.js";import"./Button-Ce-wB0G_.js";import"./utils-DALzhVoK.js";import"./Label-D7GSmtfn.js";import"./Hidden-BedOfKsW.js";import"./useFocusRing-rcGClAZz.js";import"./openLink-m4-wtxGX.js";import"./useLabel-DttkFmAP.js";import"./useLabels-B3aofaea.js";import"./number-CqHCUUB4.js";import"./I18nProvider-DDduGJCb.js";import"./useButton-Br7mSKpa.js";import"./usePress-RR4GC8Vt.js";import"./textSelection-BxRq1vrn.js";import"./useHover-CNCT38hS.js";import"./FieldError-ajciDvon.js";import"./Text-C6vZ8XAa.js";import"./useFormValidation-BrZcKhVQ.js";import"./ListBox-DtjTlX1-.js";import"./useCollection-CcbpGAId.js";import"./keyboard-DWqMnDLI.js";import"./FocusScope-B1T8Xa9R.js";import"./useEvent-DIgtVdes.js";import"./useControlledState-BYvHYB8a.js";import"./getItemCount-CYeHBSCZ.js";import"./Autocomplete-CLdpdlQF.js";import"./useLocalizedStringFormatter-BEmC_YO6.js";import"./useListState-CxhK3Zge.js";import"./Dialog-1i4lCtb4.js";import"./Heading-CPCq6sI-.js";import"./useOverlayTriggerState-Bvm7VbjX.js";import"./VisuallyHidden-CzanKvmL.js";import"./animation-DroFJ5da.js";import"./useField-DPmJ-tA5.js";import"./useFormReset-C4aB3TBa.js";import"./Input-tMw-Q_4-.js";import"./SearchField-DUA2Dtkm.js";import"./useTextField-DMKViTdg.js";import"./useFilter-BsZD2Zmw.js";import"./useCollectionAdapter-rwFckrC1.js";import"./Avatar-Be39mKtc.js";import"./Skeleton-DAXhvWWn.js";import"./FieldLabel-C1E3TDO_.js";import"./FieldError-BVGYWWhr.js";import"./Popover-B8zllCJN.js";import"./Text-DEbeIV5h.js";import"./ButtonIcon-CLqLS6zp.js";const p=()=>{},le={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:m,pageSize:g,totalCount:c})=>{const u=Math.floor((m??0)/g)+1,l=Math.ceil((c??0)/g);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
