import{T as P}from"./TablePagination-C2pCF7mm.js";import"./iframe-D_sJ6DQq.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-C71_ODYl.js";import"./index-BDjCUC6F.js";import"./Select-C6QQeF9T.js";import"./Button-B76pvApp.js";import"./utils-rcqHDtde.js";import"./Label-CqUgdJka.js";import"./Hidden-B0JsmZw6.js";import"./useFocusRing-DDwhFymc.js";import"./openLink-DVi3OW0T.js";import"./useLabel-JU3kQl_C.js";import"./useLabels-CtqB2Ot9.js";import"./number-Dv4CgBIP.js";import"./I18nProvider-Bnu7qnYs.js";import"./useButton-BuKBKhUn.js";import"./usePress-LFrjKvgu.js";import"./textSelection-5Cu1iBDL.js";import"./getMetaValue-DT9wVw6b.js";import"./useHover-CC1tHz-Y.js";import"./FieldError-CD2mDzmR.js";import"./Text-CukGZgZw.js";import"./Form-BXoeFdX8.js";import"./useFormValidation-CZ1LA-b2.js";import"./ListBox-Bnw0gD-X.js";import"./useCollection-BZrfI6w5.js";import"./keyboard-NWCLTI3I.js";import"./FocusScope-CdP29dN2.js";import"./useEvent-CDKl63CX.js";import"./useControlledState-F0ZESx8Q.js";import"./useLoadMoreSentinel-CraZ1CkX.js";import"./Autocomplete-eTntpY6G.js";import"./useLocalizedStringFormatter-C7VBNrzb.js";import"./SelectionIndicator-BZePfqOL.js";import"./useListState-BH7RMIgK.js";import"./Dialog-B73dr1WP.js";import"./Heading-B4So50dI.js";import"./useOverlayTriggerState-D-wAUn4a.js";import"./VisuallyHidden-Blk8A0BW.js";import"./animation-uPm_hcT3.js";import"./useField-gSzBaL8y.js";import"./useFormReset-DHxzgEZr.js";import"./Input-DbjRx16d.js";import"./SearchField-B-14swhZ.js";import"./useTextField-CCQt5UyT.js";import"./useFilter-k29km2gM.js";import"./useCollectionAdapter-B325902M.js";import"./Avatar-B_gKSokk.js";import"./Skeleton-BJpv2lQ5.js";import"./FieldLabel-D2twxKYA.js";import"./FieldError-_EroCQCO.js";import"./Popover-DBTdBNKU.js";import"./Text-DkYMqMyY.js";import"./ButtonIcon-DMG0d2wX.js";const p=()=>{},de={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:g,pageSize:m,totalCount:c})=>{const u=Math.floor((g??0)/m)+1,l=Math.ceil((c??0)/m);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
