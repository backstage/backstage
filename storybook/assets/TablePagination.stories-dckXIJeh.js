import{T as P}from"./TablePagination-mMtPBI8d.js";import"./iframe-DQtIir6_.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-DXWxL9lA.js";import"./index-DAbm8TV7.js";import"./Select-CR_GZgnk.js";import"./Button-hU1qrjNo.js";import"./utils-Bxehr4HY.js";import"./Label-CAcSZgVu.js";import"./Hidden-BXNE10bz.js";import"./useFocusRing-C5ZfLx-L.js";import"./openLink-DLb8P_7j.js";import"./useLabel-mAp9Q6tE.js";import"./useLabels-DLIlGtBk.js";import"./number-CQw8CDov.js";import"./I18nProvider-DPDmyrTN.js";import"./useButton-yvh0BHKl.js";import"./usePress-T3jvNl8O.js";import"./textSelection-Nrcy7rMY.js";import"./useHover-Dsk-KXl4.js";import"./FieldError-X1ho85_q.js";import"./Text-C6rkAhiv.js";import"./useFormValidation-CcujdjyJ.js";import"./ListBox-CL87kPUx.js";import"./useCollection-DgHWP1O0.js";import"./keyboard-CcRtsJxd.js";import"./FocusScope-BBiWJUPZ.js";import"./useEvent-CfByOP8u.js";import"./useControlledState-DM-B3g3-.js";import"./getItemCount-CVX00gh7.js";import"./Autocomplete-CbdvlYso.js";import"./useLocalizedStringFormatter-DGn_4eCR.js";import"./useListState-BnLB_jOB.js";import"./Dialog-7WeMafGQ.js";import"./Heading-BHHcqdTe.js";import"./useOverlayTriggerState-BR5G58Ql.js";import"./VisuallyHidden-CmFx4Hen.js";import"./animation-BlVyC_Be.js";import"./useField-X2MxXqm2.js";import"./useFormReset-BmTewx61.js";import"./Input-DhaMJBF2.js";import"./SearchField-BYdwdggT.js";import"./useTextField-fgQA1ZSg.js";import"./useFilter-CKsTtfCn.js";import"./useCollectionAdapter-BE_0ZDyv.js";import"./Avatar-ByOuy0hV.js";import"./Skeleton-D-NpgY3w.js";import"./FieldLabel-DA9MeHA9.js";import"./FieldError-17Foyh5_.js";import"./Popover-Ahy093to.js";import"./Text-B6ISVKHE.js";import"./ButtonIcon-DlTdXCD7.js";const p=()=>{},le={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:m,pageSize:g,totalCount:c})=>{const u=Math.floor((m??0)/g)+1,l=Math.ceil((c??0)/g);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
