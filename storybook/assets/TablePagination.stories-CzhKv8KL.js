import{T as P}from"./TablePagination-BHP-esK6.js";import"./iframe-7FfCsjQc.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-CsTMWTDw.js";import"./index-BXkdWngf.js";import"./Select-Pe5_qGKP.js";import"./Button-nF4s0KaT.js";import"./utils-DkNeRnP6.js";import"./Label-CfvtIL-W.js";import"./Hidden-DWfTAcXo.js";import"./useFocusRing-CHKTV0kp.js";import"./openLink-Ce5UoBQT.js";import"./useLabel-CcTyycKi.js";import"./useLabels-D-zjlwnt.js";import"./number-DWRq-mjd.js";import"./I18nProvider-s8LwHCKO.js";import"./useButton-CTCTOTVx.js";import"./usePress-DKLyQD2V.js";import"./textSelection-D55lhVzK.js";import"./getMetaValue-DunJaaKa.js";import"./useHover-Br5T7sDg.js";import"./FieldError-DlP5L_Ea.js";import"./Text-gD4wc_j1.js";import"./Form-qI6nggP9.js";import"./useFormValidation-Bf6DMqH_.js";import"./ListBox-BHVPyL-0.js";import"./useCollection-Bl5Yq63u.js";import"./keyboard-B3r4E7N4.js";import"./FocusScope-Dq2-_t9h.js";import"./useEvent-Bzfc_gjv.js";import"./useControlledState-By3FW3bK.js";import"./useLoadMoreSentinel-BYVQ9RpI.js";import"./Autocomplete-BcfTfzIB.js";import"./useLocalizedStringFormatter-xBjTaWVb.js";import"./SelectionIndicator-CIUewUGj.js";import"./useListState-hav0q8Ol.js";import"./Dialog-CTbQt-_b.js";import"./Heading-DIStzqSg.js";import"./useOverlayTriggerState-8g9hD9p5.js";import"./VisuallyHidden-DkHGc8x1.js";import"./animation-Drt1ngHL.js";import"./useField-BWh8M6zw.js";import"./useFormReset-CROC2zjd.js";import"./Input-DyO4o2aC.js";import"./SearchField-228v7GeR.js";import"./useTextField-SsEV2ZCG.js";import"./useFilter-CDWn9WkE.js";import"./useCollectionAdapter-B0Eqlxne.js";import"./Avatar-DO14KQ06.js";import"./Skeleton-D3S_ZVHI.js";import"./FieldLabel-D9Z1Z2hw.js";import"./FieldError-b6gabSH2.js";import"./Popover-CkjL23ly.js";import"./Text-D0MOEFYc.js";import"./ButtonIcon-P8R9Bow_.js";const p=()=>{},de={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:g,pageSize:m,totalCount:c})=>{const u=Math.floor((g??0)/m)+1,l=Math.ceil((c??0)/m);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
