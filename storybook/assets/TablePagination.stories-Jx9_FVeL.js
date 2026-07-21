import{T as P}from"./TablePagination-B48NH750.js";import"./iframe-DmKIhSd4.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-DibnPYi9.js";import"./index-BPEgRMek.js";import"./Select-DwN4_XH1.js";import"./Button--V2N_X5K.js";import"./utils-Bp1UFdf_.js";import"./Label-C46amIDy.js";import"./Hidden-B2CHbqyo.js";import"./useFocusRing-DrLz8-Tu.js";import"./openLink-Zk6hhSyn.js";import"./useLabel-BhsNw667.js";import"./useLabels-B-OZcbcW.js";import"./number-8YiafpBN.js";import"./I18nProvider-BA08ZmK6.js";import"./useButton-DGptM25J.js";import"./usePress-DvOXzaHx.js";import"./textSelection-DOq0Tvnx.js";import"./useHover-CwSUiPfU.js";import"./FieldError-CirVGv2n.js";import"./Text-Byu4ntdl.js";import"./useFormValidation-Cc5Povv1.js";import"./ListBox-53KT6IV9.js";import"./useCollection-DMTpsXv-.js";import"./keyboard-Ds5EVepz.js";import"./FocusScope-CTFUQOY7.js";import"./useEvent-CsZ4P3K8.js";import"./useControlledState-OVmM0QOa.js";import"./getItemCount-D3bHvsi2.js";import"./Autocomplete-C5Sghm7K.js";import"./useLocalizedStringFormatter-D0LOo8fp.js";import"./useListState-Dq51oWO1.js";import"./Dialog-kkWq3T68.js";import"./Heading-D6VX8i-P.js";import"./useOverlayTriggerState-B-0MWh2c.js";import"./VisuallyHidden-BG0wcyw6.js";import"./animation-i-bGx-PV.js";import"./useField-CxXZZEuS.js";import"./useFormReset-DQqa-4LG.js";import"./Input-DtmKW4qJ.js";import"./SearchField-BX4zF7Cd.js";import"./useTextField-4a3KQF0X.js";import"./useFilter-CMg65DGm.js";import"./useCollectionAdapter-x10u0B4v.js";import"./Avatar-iwONHH-E.js";import"./Skeleton-2OANSK3C.js";import"./FieldLabel-D-V-nnPX.js";import"./FieldError-Cex0IS75.js";import"./Popover-sYN5qRzg.js";import"./Text-BicYU9XU.js";import"./ButtonIcon-CSuiwOk1.js";const p=()=>{},le={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:m,pageSize:g,totalCount:c})=>{const u=Math.floor((m??0)/g)+1,l=Math.ceil((c??0)/g);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
