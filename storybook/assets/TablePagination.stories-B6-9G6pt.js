import{T as P}from"./TablePagination-kCcfaEcH.js";import"./iframe-BiC6vzfc.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-rJAA83qf.js";import"./index-BGy42kW1.js";import"./Select-Ys4lSWSN.js";import"./Button-CSCohGDT.js";import"./utils-BQPJ15nW.js";import"./Label-Dt81RO29.js";import"./Hidden-DdtniuZ_.js";import"./useFocusRing-CYz7DZLf.js";import"./openLink-fglnGFM4.js";import"./useLabel-CfyoKpiQ.js";import"./useLabels-Kk8q7j9x.js";import"./number-CQJyNM_c.js";import"./I18nProvider-DJaDCNar.js";import"./useButton-EPm5NcFx.js";import"./usePress-Czxg5-q_.js";import"./textSelection-BLan3Cos.js";import"./useHover-CRtjWjkD.js";import"./FieldError-BQCqgleQ.js";import"./Text-DJ4PbFTT.js";import"./useFormValidation-D7qN8pdJ.js";import"./ListBox-BPNtzyPA.js";import"./useCollection-B42IhdHb.js";import"./keyboard-D5DMZ6gP.js";import"./FocusScope-wenHxxG1.js";import"./useEvent-Dd_RM8Os.js";import"./useControlledState-CjMsoNHV.js";import"./getItemCount-DeU0FbhD.js";import"./Autocomplete-L6wt6zc3.js";import"./useLocalizedStringFormatter-D_kpWZGR.js";import"./useListState-PwbmWUAf.js";import"./Dialog-C1cXOchU.js";import"./Heading-VJFmb6mV.js";import"./useOverlayTriggerState-CjTLIV8R.js";import"./VisuallyHidden-DwJsbRnS.js";import"./animation-89PtgvT4.js";import"./useField-BK37-c9c.js";import"./useFormReset-Cq9Z1B3A.js";import"./Input-BvY9P7oi.js";import"./SearchField-CIaKxxPD.js";import"./useTextField-sAn9ne3h.js";import"./useFilter-BT9flZnW.js";import"./useCollectionAdapter-cPD9tybp.js";import"./Avatar-D6ykJs6O.js";import"./Skeleton-BMBe-3Vx.js";import"./FieldLabel-YS6TaZnc.js";import"./FieldError-BoToQClP.js";import"./Popover-BIOndtj0.js";import"./Text-DfVerI7c.js";import"./ButtonIcon-pfvj9qzl.js";const p=()=>{},le={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:m,pageSize:g,totalCount:c})=>{const u=Math.floor((m??0)/g)+1,l=Math.ceil((c??0)/g);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
