import{T as P}from"./TablePagination-IJj4SPHa.js";import"./iframe-CMSX-Slv.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-BtQagX3Q.js";import"./index-DnnZFGoL.js";import"./Select-DlV2xBy0.js";import"./Button-C89HVwFt.js";import"./utils-lN068qtb.js";import"./Label-QJ7mfr_v.js";import"./Hidden-kIQntXwy.js";import"./useFocusRing-DUZK2ZXK.js";import"./openLink-p0OhMCOD.js";import"./useLabel-BoN1kqrs.js";import"./useLabels-B9A8JaNL.js";import"./number-gVXFFl9I.js";import"./I18nProvider-B2rLmNuT.js";import"./useButton-C_sygl1c.js";import"./usePress-BzSNyydx.js";import"./textSelection-CwsB_5f_.js";import"./getMetaValue-DyXwXlFD.js";import"./useHover-D7owYt-e.js";import"./FieldError-BqVen_RV.js";import"./Text-CcBkJcX0.js";import"./Form-Bo24afV9.js";import"./useFormValidation-CxDn_wUg.js";import"./ListBox-B_Wi1ZMb.js";import"./useCollection-C55LZDbY.js";import"./keyboard-DZQobsnO.js";import"./FocusScope-hnaFZs9t.js";import"./useEvent-BikmhAJg.js";import"./useControlledState-DUMTY9Yj.js";import"./useLoadMoreSentinel-CTkpujsH.js";import"./Autocomplete-QSoLsmg6.js";import"./useLocalizedStringFormatter-DNWACNIN.js";import"./SelectionIndicator-B0WiXYe-.js";import"./useListState-DfNyrXkH.js";import"./Dialog-Fw8yCkvG.js";import"./Heading-Dia6c8Ve.js";import"./useOverlayTriggerState-u57ke4k2.js";import"./VisuallyHidden-BP5VTP-I.js";import"./animation-rB_Nrf2Y.js";import"./useField-B0e6CrK8.js";import"./useFormReset-CIL9IUM3.js";import"./Input-Cw-knjtb.js";import"./SearchField-BXu4aPO1.js";import"./useTextField-Drkqegd4.js";import"./useFilter-BpAAqLEH.js";import"./useCollectionAdapter-Jc7I-P9X.js";import"./Avatar-BaOGJYh-.js";import"./Skeleton-B7QZARWi.js";import"./FieldLabel-C_TPhTqn.js";import"./FieldError-DmYCA2df.js";import"./Popover-sRc9QsrS.js";import"./Text-C7y2DDeV.js";import"./ButtonIcon-DN3nNPiF.js";const p=()=>{},de={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:g,pageSize:m,totalCount:c})=>{const u=Math.floor((g??0)/m)+1,l=Math.ceil((c??0)/m);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
