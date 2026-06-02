import{bg as x,cH as P,bR as e,ca as v,c7 as I}from"./iframe-DogXi1kP.js";import{a as C,$ as j,f as V,d as T,c as q,g as H,h as G,e as M,m as A,b as o,l as N,k as w,j as E}from"./DatePicker-CRjletPF.js";import{b as R}from"./Button-Fh9tm360.js";import{$ as U}from"./Input-BStAHKnh.js";import{R as Y,J as O,F as J}from"./index-RV6Ph9vd.js";import{$ as Z}from"./Heading-CeGRyyrD.js";import{F as K}from"./FieldLabel-DFPXv5Zo.js";import{F as Q}from"./FieldError-VyUtu5uM.js";import{P as X}from"./Popover-BtilOXVD.js";import{a as ee}from"./useFormValidation-BIYlJHZ1.js";import{$ as ae}from"./I18nProvider-Cag9fozJ.js";import{B as re}from"./Button-DOk-0Wn9.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-AxfqVSE9.js";import"./useObjectRef-UHrM_yCs.js";import"./Text-BRIb-OAb.js";import"./useFocusRing-mENG_ikp.js";import"./openLink-CxuZpafj.js";import"./useLocalizedStringFormatter-CfgpiWB3.js";import"./useLabels-DnC-SBWU.js";import"./useUpdateEffect-DmuMjo48.js";import"./getItemCount-C0QHxlzQ.js";import"./useCollection-D7sNZtry.js";import"./Hidden-CYdnfqbh.js";import"./keyboard-a1n3wmz-.js";import"./FocusScope-C_GT869N.js";import"./useEvent-EwjaUY4k.js";import"./usePress-PepYZ5yJ.js";import"./textSelection-QdGxsqrV.js";import"./useControlledState-CrzRLYRc.js";import"./useHover-ox9S2Piy.js";import"./VisuallyHidden-BwKEPC3N.js";import"./useField-DTPdncVL.js";import"./useLabel-DvnqIlMC.js";import"./useFormReset-CXIeSoiQ.js";import"./useFilter-CBfUSc_L.js";import"./useSpinButton-AQYg4rqA.js";import"./number-C2ZI7feN.js";import"./Dialog-CuUASSK4.js";import"./useOverlayTriggerState-NZ_YQKiz.js";import"./Autocomplete-DYW-F-Tj.js";import"./animation-NVFnR0bW.js";import"./FieldError-CzpSx-Mx.js";import"./Label-BT3yvL3F.js";import"./useButton-C2CjCUzA.js";import"./definition-Bl2138zY.js";const h={"bui-DateRangePicker":"_bui-DateRangePicker_1f8sy_24","bui-DateRangePickerGroup":"_bui-DateRangePickerGroup_1f8sy_36","bui-DateRangePickerButton":"_bui-DateRangePickerButton_1f8sy_87","bui-DateRangePickerDateFields":"_bui-DateRangePickerDateFields_1f8sy_98","bui-DateRangePickerDateInput":"_bui-DateRangePickerDateInput_1f8sy_112","bui-DateRangePickerSegment":"_bui-DateRangePickerSegment_1f8sy_132","bui-DateRangePickerSeparator":"_bui-DateRangePickerSeparator_1f8sy_172","bui-DateRangePickerCalendar":"_bui-DateRangePickerCalendar_1f8sy_218","bui-DateRangePickerCalendarHeader":"_bui-DateRangePickerCalendarHeader_1f8sy_223","bui-DateRangePickerCalendarHeading":"_bui-DateRangePickerCalendarHeading_1f8sy_230","bui-DateRangePickerCalendarNavButton":"_bui-DateRangePickerCalendarNavButton_1f8sy_239","bui-DateRangePickerCalendarGrid":"_bui-DateRangePickerCalendarGrid_1f8sy_272","bui-DateRangePickerCalendarHeaderCell":"_bui-DateRangePickerCalendarHeaderCell_1f8sy_278","bui-DateRangePickerCalendarCell":"_bui-DateRangePickerCalendarCell_1f8sy_296"},te=x()({styles:h,classNames:{root:"bui-DateRangePicker"},propDefs:{size:{dataAttribute:!0,default:"small"},className:{},label:{},description:{},secondaryLabel:{}}}),se=x()({styles:h,classNames:{root:"bui-DateRangePickerGroup",dateFields:"bui-DateRangePickerDateFields",dateInput:"bui-DateRangePickerDateInput",segment:"bui-DateRangePickerSegment",separator:"bui-DateRangePickerSeparator",button:"bui-DateRangePickerButton"},bg:"consumer",propDefs:{}}),ie=x()({styles:h,classNames:{root:"bui-DateRangePickerCalendar",header:"bui-DateRangePickerCalendarHeader",heading:"bui-DateRangePickerCalendarHeading",navButton:"bui-DateRangePickerCalendarNavButton",grid:"bui-DateRangePickerCalendarGrid",gridHeader:"bui-DateRangePickerCalendarGridHeader",headerCell:"bui-DateRangePickerCalendarHeaderCell",gridBody:"bui-DateRangePickerCalendarGridBody",cell:"bui-DateRangePickerCalendarCell"},propDefs:{}}),S=({dataSize:r})=>{const{ownProps:a,dataAttributes:i}=P(se,{}),{classes:t}=a;return e.jsxs(U,{className:t.root,...i,...r?{"data-size":r}:{},children:[e.jsxs("div",{className:t.dateFields,children:[e.jsx(C,{slot:"start",className:t.dateInput,children:l=>e.jsx(j,{segment:l,className:t.segment})}),e.jsx("span",{"aria-hidden":"true",className:t.separator,children:"–"}),e.jsx(C,{slot:"end",className:t.dateInput,children:l=>e.jsx(j,{segment:l,className:t.segment})})]}),e.jsx(R,{className:t.button,"aria-label":"Open calendar",children:e.jsx(Y,{size:16,"aria-hidden":"true"})})]})};S.__docgenInfo={description:`Custom field group for DateRangePicker — renders two DateInput fields,
a separator, and a calendar trigger button.

@internal`,methods:[],displayName:"DateRangePickerGroup",props:{dataSize:{required:!1,tsType:{name:"string"},description:""}}};const B=()=>{const{ownProps:r}=P(ie,{}),{classes:a}=r;return e.jsxs(V,{className:a.root,children:[e.jsxs("header",{className:a.header,children:[e.jsx(R,{slot:"previous",className:a.navButton,children:e.jsx(O,{size:16,"aria-hidden":"true"})}),e.jsx(Z,{className:a.heading}),e.jsx(R,{slot:"next",className:a.navButton,children:e.jsx(J,{size:16,"aria-hidden":"true"})})]}),e.jsxs(T,{className:a.grid,children:[e.jsx(q,{className:a.gridHeader,children:i=>e.jsx(H,{className:a.headerCell,children:i})}),e.jsx(G,{className:a.gridBody,children:i=>e.jsx(M,{className:a.cell,date:i})})]})]})};B.__docgenInfo={description:`Calendar popover content for DateRangePicker — renders the RangeCalendar
with navigation and a full calendar grid.

@internal`,methods:[],displayName:"DateRangePickerCalendar"};const n=v.forwardRef((r,a)=>{const{ownProps:i,restProps:t,dataAttributes:l}=P(te,r),{classes:L,label:k,description:F,secondaryLabel:W}=i,$=t["aria-label"],_=t["aria-labelledby"];v.useEffect(()=>{!k&&!$&&!_&&console.warn("DateRangePicker requires either a visible label, aria-label, or aria-labelledby for accessibility")},[k,$,_]);const z=W||(t.isRequired?"Required":null);return e.jsxs(A,{className:L.root,...l,...t,ref:a,children:[e.jsx(K,{label:k,secondaryLabel:z,description:F,descriptionSlot:"description"}),e.jsx(S,{dataSize:l["data-size"]}),e.jsx(Q,{}),e.jsx(X,{hideArrow:!0,children:e.jsx(B,{})})]})});n.displayName="DateRangePicker";n.__docgenInfo={description:`A date range picker that combines two date fields and a calendar popover,
allowing users to enter or select a date range with full keyboard and
screen reader accessibility.

@public`,methods:[],displayName:"DateRangePicker",props:{size:{required:!1,tsType:{name:"union",raw:"'small' | 'medium' | Partial<Record<Breakpoint, 'small' | 'medium'>>",elements:[{name:"literal",value:"'small'"},{name:"literal",value:"'medium'"},{name:"Partial",elements:[{name:"Record",elements:[{name:"union",raw:"'initial' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'",elements:[{name:"literal",value:"'initial'"},{name:"literal",value:"'xs'"},{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"},{name:"literal",value:"'lg'"},{name:"literal",value:"'xl'"}]},{name:"union",raw:"'small' | 'medium'",elements:[{name:"literal",value:"'small'"},{name:"literal",value:"'medium'"}]}],raw:"Record<Breakpoint, 'small' | 'medium'>"}],raw:"Partial<Record<Breakpoint, 'small' | 'medium'>>"}]},description:`The size of the date range picker
@defaultValue 'small'`},className:{required:!1,tsType:{name:"string"},description:""},label:{required:!1,tsType:{name:"FieldLabelProps['label']",raw:"FieldLabelProps['label']"},description:""},description:{required:!1,tsType:{name:"FieldLabelProps['description']",raw:"FieldLabelProps['description']"},description:""},secondaryLabel:{required:!1,tsType:{name:"FieldLabelProps['secondaryLabel']",raw:"FieldLabelProps['secondaryLabel']"},description:""}},composes:["Omit"]};const s=I.meta({title:"Backstage UI/DateRangePicker",component:n,args:{style:{width:360}}}),c=s.story({args:{}}),p=s.story({args:{label:"Date range"}}),u=s.story({args:{label:"Date range",description:"Select a start and end date for your event."}}),m=s.story({args:{label:"Booking period",defaultValue:{start:o("2025-02-03"),end:o("2025-02-14")}}}),g=s.story({args:{label:"Date range"},render:r=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem",width:360},children:[e.jsx(n,{...r,size:"small",label:"Small"}),e.jsx(n,{...r,size:"medium",label:"Medium"})]})}),b=s.story({args:{label:"Trip dates",isRequired:!0},render:r=>e.jsxs(ee,{onSubmit:a=>{a.preventDefault()},style:{display:"flex",flexDirection:"column",gap:"1rem",width:360},children:[e.jsx(n,{...r}),e.jsx(re,{type:"submit",children:"Submit"})]})}),f=s.story({args:{label:"Date range",isDisabled:!0,defaultValue:{start:o("2025-03-01"),end:o("2025-03-15")}}}),D=s.story({args:{label:"Date range",isInvalid:!0,errorMessage:"The selected range is not available.",defaultValue:{start:o("2025-04-01"),end:o("2025-04-10")}}}),y=s.story({args:{label:"Date range",description:"You can only select dates within the next 30 days.",minValue:N(w()),maxValue:N(w()).add({days:30})}}),d=s.story({render:r=>{const{locale:a}=ae();return e.jsx(n,{...r,label:"Working days only",description:"Weekends are unavailable. You cannot select a range that spans across them.",isDateUnavailable:i=>E(i,a)})}});c.input.parameters={...c.input.parameters,docs:{...c.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...D.input.parameters?.docs?.source}}};y.input.parameters={...y.input.parameters,docs:{...y.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    label: 'Date range',
    description: 'You can only select dates within the next 30 days.',
    minValue: today(getLocalTimeZone()),
    maxValue: today(getLocalTimeZone()).add({
      days: 30
    })
  }
})`,...y.input.parameters?.docs?.source}}};d.input.parameters={...d.input.parameters,docs:{...d.input.parameters?.docs,source:{originalSource:`meta.story({
  render: args => {
    const {
      locale
    } = useLocale();
    return <DateRangePicker {...args} label="Working days only" description="Weekends are unavailable. You cannot select a range that spans across them." isDateUnavailable={date => isWeekend(date, locale)} />;
  }
})`,...d.input.parameters?.docs?.source},description:{story:`Weekends are marked unavailable. Because \`allowsNonContiguousRanges\` is not
set (defaults to false), the picker prevents the user from selecting any
range that spans across an unavailable date — the selection snaps to avoid
crossing a weekend.`,...d.input.parameters?.docs?.description}}};const Qe=["Default","WithLabel","WithDescription","WithDefaultValue","Sizes","Required","Disabled","Invalid","WithMinMaxValue","WithUnavailableDates"];export{c as Default,f as Disabled,D as Invalid,b as Required,g as Sizes,m as WithDefaultValue,u as WithDescription,p as WithLabel,y as WithMinMaxValue,d as WithUnavailableDates,Qe as __namedExportsOrder};
