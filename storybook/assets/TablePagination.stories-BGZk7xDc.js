import{T as P}from"./TablePagination-Dy0yw62F.js";import"./iframe-VdnJkTLn.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-DROp5jky.js";import"./index-CJ6_QBDM.js";import"./Select-BGGOdedN.js";import"./Button-FF_83t8w.js";import"./utils-e0WViHPf.js";import"./Label-DrU_Nnv8.js";import"./Hidden-CrjggcFY.js";import"./useFocusRing-Co2F4F7Z.js";import"./openLink-CXHSNm_V.js";import"./useLabel-Bo0JsgFk.js";import"./useLabels-BVBXvlsz.js";import"./number-LCWSkLep.js";import"./I18nProvider-DuHW1abH.js";import"./useButton-DimFA1zM.js";import"./usePress-CP53JbFw.js";import"./textSelection-KD-GHk6k.js";import"./getMetaValue-Bnreontc.js";import"./useHover-g0RbdZFi.js";import"./FieldError-B3u2kknD.js";import"./Text-7WPcyscW.js";import"./Form-CzyO95mO.js";import"./useFormValidation-DfF2vLy2.js";import"./ListBox-CICl156-.js";import"./useCollection-Br8OUFQ_.js";import"./keyboard-4UFf3oj2.js";import"./FocusScope-ClqMUDpT.js";import"./useEvent-Bizq2OSF.js";import"./useControlledState-BaeUY-xI.js";import"./useLoadMoreSentinel-y6LHfwV4.js";import"./Autocomplete-u1URa5fd.js";import"./useLocalizedStringFormatter-CHFqquPO.js";import"./SelectionIndicator-HJwkdeTK.js";import"./useListState-DytFXOuB.js";import"./Dialog-DgWiF4Q5.js";import"./Heading-C2TWwXcr.js";import"./useOverlayTriggerState-DSnKjkPC.js";import"./VisuallyHidden-BEl231es.js";import"./animation-5xKztEYB.js";import"./useField-CsdjVyDw.js";import"./useFormReset-B9eW7vtg.js";import"./Input-D2uS1ljc.js";import"./SearchField-C4sKkBca.js";import"./useTextField-BekYY1fq.js";import"./useFilter-CLfxtcUI.js";import"./useCollectionAdapter-Cux9L63t.js";import"./Avatar-KRMGe9HG.js";import"./Skeleton-BLRZqE1q.js";import"./FieldLabel-F_wOjT_e.js";import"./FieldError-0qd6BDyW.js";import"./Popover-D88d9fnV.js";import"./Text-CkSWf3Bg.js";import"./ButtonIcon-Bxuh7WRh.js";const p=()=>{},de={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:g,pageSize:m,totalCount:c})=>{const u=Math.floor((g??0)/m)+1,l=Math.ceil((c??0)/m);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
