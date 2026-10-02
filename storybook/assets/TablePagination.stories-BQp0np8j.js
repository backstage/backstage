import{T as P}from"./TablePagination-DMUZfjbU.js";import"./iframe-DOtOeTqo.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-BWUUeiPu.js";import"./index-BlBcDPbs.js";import"./Select-Bp_FUY1R.js";import"./Button-BEAJi762.js";import"./utils-pgFMei_k.js";import"./Label-BxIKHFQ8.js";import"./Hidden-CxPa8WIq.js";import"./useFocusRing-BXb8q1JL.js";import"./openLink-CJNg7ARK.js";import"./useLabel-DH87djdw.js";import"./useLabels-BnFtLpP2.js";import"./number-Bmc2WaUx.js";import"./I18nProvider-DuDY5T7I.js";import"./useButton-nXyYv-0V.js";import"./usePress-BQ7zB3R2.js";import"./textSelection-8fES9RA1.js";import"./useHover-CLTRyNT2.js";import"./FieldError-BZUytoyE.js";import"./Text-CUFEUyEl.js";import"./useFormValidation-NUNxJZWW.js";import"./ListBox-BTKNHs4G.js";import"./useCollection-ywvIf1ZR.js";import"./keyboard-Dpz_eYv5.js";import"./FocusScope-8l1FH1do.js";import"./useEvent-KvN5j0jW.js";import"./useControlledState-BfKz3a4E.js";import"./getItemCount-DQUCnSau.js";import"./Autocomplete-CvKotD4o.js";import"./useLocalizedStringFormatter-BO4d3GOf.js";import"./useListState-BmjKsDQ8.js";import"./Dialog-CiCl0SZu.js";import"./Heading-Ct93H_J-.js";import"./useOverlayTriggerState-CMprxMq5.js";import"./VisuallyHidden-LCnCHlaD.js";import"./animation-PioyXRyy.js";import"./useField-M0TANDTX.js";import"./useFormReset-DPXLv5Gr.js";import"./Input-CoNrOVCs.js";import"./SearchField-CRR7sSDC.js";import"./useTextField-JZBlAGZ1.js";import"./useFilter-MznAiwUS.js";import"./useCollectionAdapter-D_SL3S73.js";import"./Avatar-BLTBYpBo.js";import"./Skeleton-BeMeCO3S.js";import"./FieldLabel-CpJk1BjS.js";import"./FieldError-BwO9S8eX.js";import"./Popover-C_ji6Ez0.js";import"./Text-oWMdABsL.js";import"./ButtonIcon-sleBnERd.js";const p=()=>{},le={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:m,pageSize:g,totalCount:c})=>{const u=Math.floor((m??0)/g)+1,l=Math.ceil((c??0)/g);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
