import{T as P}from"./TablePagination-BkCALqjR.js";import"./iframe-Q4ctuRUv.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-BFzgzp46.js";import"./index-B2PZBeFt.js";import"./Select-CELed2mD.js";import"./Button-j0bKjTfS.js";import"./utils-CTbYSeHd.js";import"./Label-BJe5bXQU.js";import"./Hidden-BhGBloyx.js";import"./useFocusRing-DiENv1rk.js";import"./openLink-qs0UDoSy.js";import"./useLabel-UNvbR8sI.js";import"./useLabels-BPBTzwbg.js";import"./number-BhqHD8kO.js";import"./I18nProvider-Bsf8nutC.js";import"./useButton-DgX1muWK.js";import"./usePress-Dnu9apiz.js";import"./textSelection-DMfLw1Y1.js";import"./getMetaValue-CITejevD.js";import"./useHover-B_-Qawkz.js";import"./FieldError-D43CsVYe.js";import"./Text-YknYtPMS.js";import"./Form-Brw3O52F.js";import"./useFormValidation-DPOCc4Gj.js";import"./ListBox-DLEuYnEf.js";import"./useCollection-C2kVYo6V.js";import"./keyboard-B0COaPZh.js";import"./FocusScope-DkxVfQOW.js";import"./useEvent-BpVCmMqU.js";import"./useControlledState-CGLHX-Pe.js";import"./useLoadMoreSentinel-xrGxrABJ.js";import"./Autocomplete-BSvySyXp.js";import"./useLocalizedStringFormatter-C234lHL1.js";import"./SelectionIndicator-Bgb9UEqr.js";import"./useListState-DMop-JDR.js";import"./Dialog-If40atmp.js";import"./Heading-BwmMR0aZ.js";import"./useOverlayTriggerState-DcH1p3io.js";import"./VisuallyHidden-DMJse-Yp.js";import"./animation-Dqeq4_Vx.js";import"./useField-Bjdaztqi.js";import"./useFormReset-Bpe--cgd.js";import"./Input-BCq2znLO.js";import"./SearchField-Ck_q9jgm.js";import"./useTextField-DQVyUx5t.js";import"./useFilter-uXDYehO-.js";import"./useCollectionAdapter-C_aIWQdk.js";import"./Avatar-DwCQQakv.js";import"./Skeleton-C40K15iU.js";import"./FieldLabel-BaXKdjOA.js";import"./FieldError-CRKMDsZY.js";import"./Popover-2bo6tApe.js";import"./Text-7YMNQ-ID.js";import"./ButtonIcon-CANv9WbN.js";const p=()=>{},de={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:g,pageSize:m,totalCount:c})=>{const u=Math.floor((g??0)/m)+1,l=Math.ceil((c??0)/m);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
