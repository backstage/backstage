import{T as P}from"./TablePagination-BYdqP67E.js";import"./iframe-DHsLdmE0.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-BT9IXX-I.js";import"./index-jVoNfn90.js";import"./Select-Dw95ymtC.js";import"./Button-BwLA299K.js";import"./utils-DojvYQxY.js";import"./Label-P7WFsVIs.js";import"./Hidden-BvNfuI3Q.js";import"./useFocusRing-CDFFyFJa.js";import"./openLink--DhT0IgB.js";import"./useLabel-oAlB9tb2.js";import"./useLabels-C6sZXPV2.js";import"./number-VsWsHW7o.js";import"./I18nProvider-CE3c3hhV.js";import"./useButton-Gf6Z0U4N.js";import"./usePress-CMIP055z.js";import"./textSelection-DkaXAg8-.js";import"./useHover-Bx2eQJmr.js";import"./FieldError-C41zcCX2.js";import"./Text-KiuYMpek.js";import"./useFormValidation-p_daFSoB.js";import"./ListBox-C1_ZVyUo.js";import"./useCollection-F6CQV3P0.js";import"./keyboard-DJ7vT83c.js";import"./FocusScope-5m3THCB0.js";import"./useEvent-FHg6aOMU.js";import"./useControlledState-DS1kZzJm.js";import"./getItemCount-D5gB_Ib0.js";import"./Autocomplete-D1vcVEPK.js";import"./useLocalizedStringFormatter-C9zCrUYj.js";import"./useListState-9KozNxim.js";import"./Dialog-I104NdsM.js";import"./Heading-DmWEi_Dt.js";import"./useOverlayTriggerState-BQSHZtPI.js";import"./VisuallyHidden-CoveyVzr.js";import"./animation-CZSxcoSu.js";import"./useField-Bkm1aCiA.js";import"./useFormReset-BUXbtica.js";import"./Input-BnA6Jzsp.js";import"./SearchField-B2rjMkRF.js";import"./useTextField-BA4kxORJ.js";import"./useFilter-CGdJG5lI.js";import"./useCollectionAdapter-BsxiPFNh.js";import"./Avatar-BmGiUfxg.js";import"./Skeleton-B33kMniX.js";import"./FieldLabel-C-VGD3sb.js";import"./FieldError-BTTmwhiE.js";import"./Popover-YrXke2il.js";import"./Text-z1q8J51f.js";import"./ButtonIcon-yStr-9RB.js";const p=()=>{},le={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:m,pageSize:g,totalCount:c})=>{const u=Math.floor((m??0)/g)+1,l=Math.ceil((c??0)/g);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
