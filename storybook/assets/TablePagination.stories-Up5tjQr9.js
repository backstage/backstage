import{T as P}from"./TablePagination-uJ0Qgoqn.js";import"./iframe-BoHeIN98.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-BJ7a64yy.js";import"./index-BNKyklS0.js";import"./Select-BkNpSziL.js";import"./Button-DKBbCIxc.js";import"./utils-NIDZfutH.js";import"./Label-D2ybsfze.js";import"./Hidden-IbUh1Tr9.js";import"./useFocusRing-CEefBRp7.js";import"./openLink-CzGsEk9E.js";import"./useLabel-CtNFeKgI.js";import"./useLabels-BSyWgRhR.js";import"./number-BG3nFjv0.js";import"./I18nProvider-kpljWjCr.js";import"./useButton-BZGAGSuM.js";import"./usePress-CJRy86Wa.js";import"./textSelection-DmFjvJW6.js";import"./useHover-Cu7H8QbB.js";import"./FieldError-iHO14wwv.js";import"./Text-Bg-pZGbN.js";import"./useFormValidation-Bi5umGFZ.js";import"./ListBox-BVKkPZM3.js";import"./useCollection-Yoa1Bd2I.js";import"./keyboard-DKS7P0hr.js";import"./FocusScope-BcC0A1Uw.js";import"./useEvent-CrAwgrPn.js";import"./useControlledState-Dk4KHo5d.js";import"./getItemCount-BdY3rlzk.js";import"./Autocomplete-B2_RbWF2.js";import"./useLocalizedStringFormatter-CKWspuV4.js";import"./useListState-BLxKxl3u.js";import"./Dialog-DBgkLTRY.js";import"./Heading-Sc-Kl13Y.js";import"./useOverlayTriggerState-dYvqLhY0.js";import"./VisuallyHidden-DxL0jdOW.js";import"./animation-djkWZwmW.js";import"./useField-rZVhVtZ5.js";import"./useFormReset-CjYaYx-G.js";import"./Input-DKJdGjLg.js";import"./SearchField-Ba60mihz.js";import"./useTextField-WfqmPdwc.js";import"./useFilter-B028fkfP.js";import"./useCollectionAdapter-Dsgyjcyp.js";import"./Avatar-D9dJm8oA.js";import"./Skeleton-kbSGuSET.js";import"./FieldLabel-BXFSLIfM.js";import"./FieldError-DAA7p0C8.js";import"./Popover--ghwLSzL.js";import"./Text-BEkeIVAV.js";import"./ButtonIcon-CYMmqe6P.js";const p=()=>{},le={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:m,pageSize:g,totalCount:c})=>{const u=Math.floor((m??0)/g)+1,l=Math.ceil((c??0)/g);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
