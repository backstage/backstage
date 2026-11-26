import{aD as R,aE as y,j as e,r as v,p as I}from"./iframe-CR1Jw9dV.js";import{$ as C,a as j,m as V,c as T,d as q,e as H,f as G,g as M,n as E,i as o,j as N,k as w,l as A}from"./DatePicker-D1t0FH1-.js";import{$ as P}from"./Button-DzhTBfgP.js";import{c as U}from"./Input-CPFU7dv3.js";import{F as Y,v as O,r as Z}from"./index-CHKdAyZ9.js";import{$ as J}from"./Heading-CQY9eX9y.js";import{F as K}from"./FieldLabel-C1xEgbnV.js";import{F as Q}from"./FieldError-BF0TTJEo.js";import{P as X}from"./Popover-Bakhe6Uu.js";import{$ as ee}from"./Form-CirHk10M.js";import{$ as ae}from"./I18nProvider-CXlyEy0i.js";import{B as re}from"./Button-CMe2mPMi.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-f1XPU8sj.js";import"./useObjectRef-CxAJnmky.js";import"./Text-BX3OTawI.js";import"./Hidden-B3uAAl_R.js";import"./useFocusRing-CCR0Dk_B.js";import"./useLocalizedStringFormatter-C4g2OxQ5.js";import"./useLabels-C65kEDvg.js";import"./useUpdateEffect-DxqUh383.js";import"./useLoadMoreSentinel-CpKLnC9F.js";import"./useCollection-B_pZRIWT.js";import"./keyboard-DwLZW9jg.js";import"./getMetaValue-QyE7lEVK.js";import"./FocusScope-BEubVjvS.js";import"./useEvent-Dm-E9hNt.js";import"./usePress-BO_FqSCY.js";import"./textSelection-DRBuEoQO.js";import"./useControlledState-BQLBMnzZ.js";import"./useHover-COtbARlD.js";import"./VisuallyHidden-DyHRdEeF.js";import"./useField-Cc85Nw2S.js";import"./useLabel-B8RNTxDr.js";import"./useFormReset-DTZFkvsG.js";import"./useFormValidation-rdS9Nj4h.js";import"./useFilter-Cbln8Yhz.js";import"./useSpinButton-Cv_moUT2.js";import"./number-CXcznxJS.js";import"./Dialog-BqIzS5Wf.js";import"./useOverlayTriggerState-BrayxibY.js";import"./Autocomplete-B2_gIgbH.js";import"./SelectionIndicator-CwTfXNxW.js";import"./animation-reWawdWv.js";import"./FieldError-xrm2enzG.js";import"./Label-C37_b03j.js";import"./useButton-HAI6nP2s.js";const h={"bui-DateRangePicker":"_bui-DateRangePicker_l7fgp_24","bui-DateRangePickerGroup":"_bui-DateRangePickerGroup_l7fgp_36","bui-DateRangePickerButton":"_bui-DateRangePickerButton_l7fgp_87","bui-DateRangePickerDateFields":"_bui-DateRangePickerDateFields_l7fgp_98","bui-DateRangePickerDateInput":"_bui-DateRangePickerDateInput_l7fgp_112","bui-DateRangePickerSegment":"_bui-DateRangePickerSegment_l7fgp_132","bui-DateRangePickerSeparator":"_bui-DateRangePickerSeparator_l7fgp_173","bui-DateRangePickerCalendar":"_bui-DateRangePickerCalendar_l7fgp_220","bui-DateRangePickerCalendarHeader":"_bui-DateRangePickerCalendarHeader_l7fgp_225","bui-DateRangePickerCalendarHeading":"_bui-DateRangePickerCalendarHeading_l7fgp_232","bui-DateRangePickerCalendarNavButton":"_bui-DateRangePickerCalendarNavButton_l7fgp_242","bui-DateRangePickerCalendarGrid":"_bui-DateRangePickerCalendarGrid_l7fgp_275","bui-DateRangePickerCalendarHeaderCell":"_bui-DateRangePickerCalendarHeaderCell_l7fgp_281","bui-DateRangePickerCalendarCell":"_bui-DateRangePickerCalendarCell_l7fgp_300"},te=R()({styles:h,classNames:{root:"bui-DateRangePicker"},propDefs:{size:{dataAttribute:!0,default:"small"},className:{},label:{},description:{},secondaryLabel:{}}}),se=R()({styles:h,classNames:{root:"bui-DateRangePickerGroup",dateFields:"bui-DateRangePickerDateFields",dateInput:"bui-DateRangePickerDateInput",segment:"bui-DateRangePickerSegment",separator:"bui-DateRangePickerSeparator",button:"bui-DateRangePickerButton"},bg:"consumer",propDefs:{}}),ie=R()({styles:h,classNames:{root:"bui-DateRangePickerCalendar",header:"bui-DateRangePickerCalendarHeader",heading:"bui-DateRangePickerCalendarHeading",navButton:"bui-DateRangePickerCalendarNavButton",grid:"bui-DateRangePickerCalendarGrid",gridHeader:"bui-DateRangePickerCalendarGridHeader",headerCell:"bui-DateRangePickerCalendarHeaderCell",gridBody:"bui-DateRangePickerCalendarGridBody",cell:"bui-DateRangePickerCalendarCell"},propDefs:{}}),S=({dataSize:r})=>{const{ownProps:a,dataAttributes:i}=y(se,{}),{classes:t}=a;return e.jsxs(U,{className:t.root,...i,...r?{"data-size":r}:{},children:[e.jsxs("div",{className:t.dateFields,children:[e.jsx(C,{slot:"start",className:t.dateInput,children:l=>e.jsx(j,{segment:l,className:t.segment})}),e.jsx("span",{"aria-hidden":"true",className:t.separator,children:"–"}),e.jsx(C,{slot:"end",className:t.dateInput,children:l=>e.jsx(j,{segment:l,className:t.segment})})]}),e.jsx(P,{className:t.button,"aria-label":"Open calendar",children:e.jsx(Y,{size:16,"aria-hidden":"true"})})]})};S.__docgenInfo={description:`Custom field group for DateRangePicker — renders two DateInput fields,
a separator, and a calendar trigger button.

@internal`,methods:[],displayName:"DateRangePickerGroup",props:{dataSize:{required:!1,tsType:{name:"string"},description:""}}};const B=()=>{const{ownProps:r}=y(ie,{}),{classes:a}=r;return e.jsxs(V,{className:a.root,children:[e.jsxs("header",{className:a.header,children:[e.jsx(P,{slot:"previous",className:a.navButton,children:e.jsx(O,{size:16,"aria-hidden":"true"})}),e.jsx(J,{className:a.heading}),e.jsx(P,{slot:"next",className:a.navButton,children:e.jsx(Z,{size:16,"aria-hidden":"true"})})]}),e.jsxs(T,{className:a.grid,children:[e.jsx(q,{className:a.gridHeader,children:i=>e.jsx(H,{className:a.headerCell,children:i})}),e.jsx(G,{className:a.gridBody,children:i=>e.jsx(M,{className:a.cell,date:i})})]})]})};B.__docgenInfo={description:`Calendar popover content for DateRangePicker — renders the RangeCalendar
with navigation and a full calendar grid.

@internal`,methods:[],displayName:"DateRangePickerCalendar"};const n=v.forwardRef((r,a)=>{const{ownProps:i,restProps:t,dataAttributes:l}=y(te,r),{classes:L,label:x,description:F,secondaryLabel:W}=i,$=t["aria-label"],_=t["aria-labelledby"];v.useEffect(()=>{!x&&!$&&!_&&console.warn("DateRangePicker requires either a visible label, aria-label, or aria-labelledby for accessibility")},[x,$,_]);const z=W||(t.isRequired?"Required":null);return e.jsxs(E,{className:L.root,...l,...t,ref:a,children:[e.jsx(K,{label:x,secondaryLabel:z,description:F,descriptionSlot:"description"}),e.jsx(S,{dataSize:l["data-size"]}),e.jsx(Q,{}),e.jsx(X,{hideArrow:!0,children:e.jsx(B,{})})]})});n.displayName="DateRangePicker";n.__docgenInfo={description:`A date range picker that combines two date fields and a calendar popover,
allowing users to enter or select a date range with full keyboard and
screen reader accessibility.

@public`,methods:[],displayName:"DateRangePicker",props:{size:{required:!1,tsType:{name:"union",raw:"'small' | 'medium' | Partial<Record<Breakpoint, 'small' | 'medium'>>",elements:[{name:"literal",value:"'small'"},{name:"literal",value:"'medium'"},{name:"Partial",elements:[{name:"Record",elements:[{name:"union",raw:"'initial' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'",elements:[{name:"literal",value:"'initial'"},{name:"literal",value:"'xs'"},{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"},{name:"literal",value:"'lg'"},{name:"literal",value:"'xl'"}]},{name:"union",raw:"'small' | 'medium'",elements:[{name:"literal",value:"'small'"},{name:"literal",value:"'medium'"}]}],raw:"Record<Breakpoint, 'small' | 'medium'>"}],raw:"Partial<Record<Breakpoint, 'small' | 'medium'>>"}]},description:`The size of the date range picker
@defaultValue 'small'`},className:{required:!1,tsType:{name:"string"},description:""},label:{required:!1,tsType:{name:"FieldLabelProps['label']",raw:"FieldLabelProps['label']"},description:""},description:{required:!1,tsType:{name:"FieldLabelProps['description']",raw:"FieldLabelProps['description']"},description:""},secondaryLabel:{required:!1,tsType:{name:"FieldLabelProps['secondaryLabel']",raw:"FieldLabelProps['secondaryLabel']"},description:""}},composes:["Omit"]};const s=I.meta({title:"Backstage UI/DateRangePicker",component:n,args:{style:{width:360}}}),c=s.story({args:{}}),p=s.story({args:{label:"Date range"}}),u=s.story({args:{label:"Date range",description:"Select a start and end date for your event."}}),m=s.story({args:{label:"Booking period",defaultValue:{start:o("2025-02-03"),end:o("2025-02-14")}}}),g=s.story({args:{label:"Date range"},render:r=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem",width:360},children:[e.jsx(n,{...r,size:"small",label:"Small"}),e.jsx(n,{...r,size:"medium",label:"Medium"})]})}),b=s.story({args:{label:"Trip dates",isRequired:!0},render:r=>e.jsxs(ee,{onSubmit:a=>{a.preventDefault()},style:{display:"flex",flexDirection:"column",gap:"1rem",width:360},children:[e.jsx(n,{...r}),e.jsx(re,{type:"submit",children:"Submit"})]})}),f=s.story({args:{label:"Date range",isDisabled:!0,defaultValue:{start:o("2025-03-01"),end:o("2025-03-15")}}}),D=s.story({args:{label:"Date range",isInvalid:!0,errorMessage:"The selected range is not available.",defaultValue:{start:o("2025-04-01"),end:o("2025-04-10")}}}),k=s.story({args:{label:"Date range",description:"You can only select dates within the next 30 days.",minValue:N(w()),maxValue:N(w()).add({days:30})}}),d=s.story({render:r=>{const{locale:a}=ae();return e.jsx(n,{...r,label:"Working days only",description:"Weekends are unavailable. You cannot select a range that spans across them.",isDateUnavailable:i=>A(i,a)})}});c.input.parameters={...c.input.parameters,docs:{...c.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {}
})`,...c.input.parameters?.docs?.source}}};p.input.parameters={...p.input.parameters,docs:{...p.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    label: 'Date range'
  }
})`,...p.input.parameters?.docs?.source}}};u.input.parameters={...u.input.parameters,docs:{...u.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    label: 'Date range',
    description: 'Select a start and end date for your event.'
  }
})`,...u.input.parameters?.docs?.source}}};m.input.parameters={...m.input.parameters,docs:{...m.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    label: 'Booking period',
    defaultValue: {
      start: parseDate('2025-02-03'),
      end: parseDate('2025-02-14')
    }
  }
})`,...m.input.parameters?.docs?.source}}};g.input.parameters={...g.input.parameters,docs:{...g.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    label: 'Date range'
  },
  render: args => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    width: 360
  }}>
      <DateRangePicker {...args} size="small" label="Small" />
      <DateRangePicker {...args} size="medium" label="Medium" />
    </div>
})`,...g.input.parameters?.docs?.source}}};b.input.parameters={...b.input.parameters,docs:{...b.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    label: 'Trip dates',
    isRequired: true
  },
  render: args => <Form onSubmit={e => {
    e.preventDefault();
  }} style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    width: 360
  }}>
      <DateRangePicker {...args} />
      <Button type="submit">Submit</Button>
    </Form>
})`,...b.input.parameters?.docs?.source}}};f.input.parameters={...f.input.parameters,docs:{...f.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    label: 'Date range',
    isDisabled: true,
    defaultValue: {
      start: parseDate('2025-03-01'),
      end: parseDate('2025-03-15')
    }
  }
})`,...f.input.parameters?.docs?.source}}};D.input.parameters={...D.input.parameters,docs:{...D.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    label: 'Date range',
    isInvalid: true,
    errorMessage: 'The selected range is not available.',
    defaultValue: {
      start: parseDate('2025-04-01'),
      end: parseDate('2025-04-10')
    }
  }
})`,...D.input.parameters?.docs?.source}}};k.input.parameters={...k.input.parameters,docs:{...k.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    label: 'Date range',
    description: 'You can only select dates within the next 30 days.',
    minValue: today(getLocalTimeZone()),
    maxValue: today(getLocalTimeZone()).add({
      days: 30
    })
  }
})`,...k.input.parameters?.docs?.source}}};d.input.parameters={...d.input.parameters,docs:{...d.input.parameters?.docs,source:{originalSource:`meta.story({
  render: args => {
    const {
      locale
    } = useLocale();
    return <DateRangePicker {...args} label="Working days only" description="Weekends are unavailable. You cannot select a range that spans across them." isDateUnavailable={date => isWeekend(date, locale)} />;
  }
})`,...d.input.parameters?.docs?.source},description:{story:`Weekends are marked unavailable. Because \`allowsNonContiguousRanges\` is not
set (defaults to false), the picker prevents the user from selecting any
range that spans across an unavailable date — the selection snaps to avoid
crossing a weekend.`,...d.input.parameters?.docs?.description}}};const Xe=["Default","WithLabel","WithDescription","WithDefaultValue","Sizes","Required","Disabled","Invalid","WithMinMaxValue","WithUnavailableDates"];export{c as Default,f as Disabled,D as Invalid,b as Required,g as Sizes,m as WithDefaultValue,u as WithDescription,p as WithLabel,k as WithMinMaxValue,d as WithUnavailableDates,Xe as __namedExportsOrder};
