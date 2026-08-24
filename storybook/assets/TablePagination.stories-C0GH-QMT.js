import{T as P}from"./TablePagination-D92l-7OZ.js";import"./iframe-BT856zKW.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-C9B7I4dA.js";import"./index-DX-mGHlN.js";import"./Select-D6A3hoNH.js";import"./Button-C7kwpLvK.js";import"./utils-CpwCIt4g.js";import"./Label-DWhvkKMc.js";import"./Hidden-49UROW8g.js";import"./useFocusRing-BT_-10ZK.js";import"./openLink-cidOSJP4.js";import"./useLabel-4EIIh35K.js";import"./useLabels-mD4IPMLK.js";import"./number-DEPRmkya.js";import"./I18nProvider-D0MkpVu-.js";import"./useButton-BY1LIf6_.js";import"./usePress-D8DHmOrO.js";import"./textSelection-BbGtchwD.js";import"./useHover-qIfqE_w_.js";import"./FieldError-C6e4WYaM.js";import"./Text-76s0V35L.js";import"./useFormValidation-GBXOaCZU.js";import"./ListBox-CUKyMzJh.js";import"./useCollection-qrRQ7ESK.js";import"./keyboard-OOu-nIBg.js";import"./FocusScope-C5yn6WOl.js";import"./useEvent-C-5yOyHh.js";import"./useControlledState-B8MFkE-b.js";import"./getItemCount-BjPsHTlG.js";import"./Autocomplete-BV1G3v_N.js";import"./useLocalizedStringFormatter-BWCbUYkC.js";import"./useListState-BANuCIhm.js";import"./Dialog-7toW9pgp.js";import"./Heading-CT1W0R0U.js";import"./useOverlayTriggerState-jSPLUxR-.js";import"./VisuallyHidden-DJz9VSfc.js";import"./animation-D-E6JIW4.js";import"./useField-BE3cQBfr.js";import"./useFormReset-BqsbtU9Q.js";import"./Input-DudLBmfR.js";import"./SearchField-CpzWT6VV.js";import"./useTextField-Dr2g0Wsf.js";import"./useFilter-DFTMyblJ.js";import"./useCollectionAdapter-RHcKKjwf.js";import"./Avatar-BI1dpeAy.js";import"./Skeleton-DXe464uG.js";import"./FieldLabel-CoOWF5Ol.js";import"./FieldError-WtUaFOLd.js";import"./Popover-CgOS9af9.js";import"./Text-BCHjowwS.js";import"./ButtonIcon-D9H8Rxke.js";const p=()=>{},le={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:m,pageSize:g,totalCount:c})=>{const u=Math.floor((m??0)/g)+1,l=Math.ceil((c??0)/g);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
