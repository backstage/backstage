import{T as P}from"./TablePagination-DI5gXF20.js";import"./iframe-Dzms4wRw.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-Ca6VrkU_.js";import"./index-D1xU2CUz.js";import"./Select-yBUTO8c7.js";import"./Button-wALy7eva.js";import"./utils-BkRQYljw.js";import"./Label-2RfDNyJG.js";import"./Hidden-0sk5EwaH.js";import"./useFocusRing-DjtUFVh9.js";import"./openLink-t121PK8W.js";import"./useLabel-Dbodnstf.js";import"./useLabels-F2kTV9EY.js";import"./number-GxmQ5IsF.js";import"./I18nProvider-C1u0qXWv.js";import"./useButton-D4mlbzSR.js";import"./usePress-Cxa0w_VA.js";import"./textSelection-D8br12C7.js";import"./useHover-enCSdk4y.js";import"./FieldError-CJ5WWEKj.js";import"./Text-j0FzBQF4.js";import"./useFormValidation-Cd58uhD2.js";import"./ListBox-Brc88tod.js";import"./useCollection-DHRD_NIQ.js";import"./keyboard-VwG3rX6J.js";import"./FocusScope-Cht7KfIq.js";import"./useEvent-BfFHw6He.js";import"./useControlledState-DlMtRXuC.js";import"./getItemCount-DAqKRaLP.js";import"./Autocomplete-DY48s6Ea.js";import"./useLocalizedStringFormatter-GdUDRRmx.js";import"./useListState-vSJ4EXJm.js";import"./Dialog-CRJz6U5T.js";import"./Heading-D-NabzCX.js";import"./useOverlayTriggerState-Dii3Ei3W.js";import"./VisuallyHidden-DODGmefc.js";import"./animation-HA6bSjMC.js";import"./useField-DAhZtRcN.js";import"./useFormReset-CDw8_EEQ.js";import"./Input-CEiWsu7-.js";import"./SearchField-D3M5e3MC.js";import"./useTextField-CG9MK4TE.js";import"./useFilter-B3Idilv6.js";import"./useCollectionAdapter-NOAqGKVo.js";import"./Avatar-BCWxOlk1.js";import"./Skeleton-DCNhQ0t6.js";import"./FieldLabel-Cxxp3V_6.js";import"./FieldError-Bx_wtC13.js";import"./Popover-CSnqed9S.js";import"./Text-B1-azolb.js";import"./ButtonIcon-DIyhhDx0.js";const p=()=>{},le={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:m,pageSize:g,totalCount:c})=>{const u=Math.floor((m??0)/g)+1,l=Math.ceil((c??0)/g);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
