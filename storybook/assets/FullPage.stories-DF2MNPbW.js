import{bg as b,ca as x,cH as P,bR as e,c7 as f,w as y}from"./iframe-Dzms4wRw.js";import{P as l}from"./PluginHeader-Bevsxk2F.js";import{C as p}from"./Container-CiOME6U3.js";import{T as t}from"./Text-B1-azolb.js";import{B as j}from"./BUIProvider-CSwrdwOu.js";import"./preload-helper-PPVm8Dsz.js";import"./index-D1xU2CUz.js";import"./utils-BkRQYljw.js";import"./useObjectRef-Ca6VrkU_.js";import"./useCollection-DHRD_NIQ.js";import"./useFocusRing-DjtUFVh9.js";import"./openLink-t121PK8W.js";import"./Hidden-0sk5EwaH.js";import"./keyboard-VwG3rX6J.js";import"./FocusScope-Cht7KfIq.js";import"./useEvent-BfFHw6He.js";import"./I18nProvider-C1u0qXWv.js";import"./usePress-Cxa0w_VA.js";import"./textSelection-D8br12C7.js";import"./useControlledState-DlMtRXuC.js";import"./Link-w-9MRKIs.js";import"./useLink-D1yAzTS-.js";import"./useHover-enCSdk4y.js";import"./useLocalizedStringFormatter-GdUDRRmx.js";import"./Button-wALy7eva.js";import"./Label-2RfDNyJG.js";import"./useLabel-Dbodnstf.js";import"./useLabels-F2kTV9EY.js";import"./number-GxmQ5IsF.js";import"./useButton-D4mlbzSR.js";import"./Menu-lRMYfHRH.js";import"./Autocomplete-DY48s6Ea.js";import"./getItemCount-DAqKRaLP.js";import"./Input-CEiWsu7-.js";import"./ListBox-Brc88tod.js";import"./Text-j0FzBQF4.js";import"./useListState-vSJ4EXJm.js";import"./Dialog-CRJz6U5T.js";import"./Heading-D-NabzCX.js";import"./useOverlayTriggerState-Dii3Ei3W.js";import"./VisuallyHidden-DODGmefc.js";import"./animation-HA6bSjMC.js";import"./SearchField-D3M5e3MC.js";import"./FieldError-CJ5WWEKj.js";import"./useFormValidation-Cd58uhD2.js";import"./useTextField-CG9MK4TE.js";import"./useField-DAhZtRcN.js";import"./useFormReset-CDw8_EEQ.js";import"./Virtualizer-DMPV34TJ.js";import"./useFilter-B3Idilv6.js";import"./getNodeText-D3k9gM7K.js";import"./Link-CcRQFxKn.js";import"./useResolvedHref-Bf9C5QCr.js";import"./Tooltip-BCMj1SD1.js";import"./VisuallyHidden-oHsEljBA.js";import"./Tabs-CWDhgVNJ.js";import"./useHasTabbableChild-GiwzuKnc.js";const w={"bui-FullPage":"_bui-FullPage_1vdnu_20"},T=b()({styles:w,classNames:{root:"bui-FullPage"},propDefs:{className:{}}}),r=x.forwardRef((i,n)=>{const{ownProps:d,restProps:h}=P(T,i),{classes:g}=d;return e.jsx("main",{ref:n,className:g.root,...h})});r.__docgenInfo={description:`A component that fills the remaining viewport height below the Header.

The FullPage component consumes the \`--bui-header-height\` CSS custom property
set by the Header component to calculate its height as
\`calc(100dvh - var(--bui-header-height, 0px))\`. Content inside the FullPage
scrolls independently while the Header stays visible.

@public`,methods:[],displayName:"FullPage",props:{className:{required:!1,tsType:{name:"string"},description:""}},composes:["Omit"]};const m=f.meta({title:"Backstage UI/FullPage",component:r,parameters:{layout:"fullscreen"}}),c=i=>e.jsx(y,{children:e.jsx(j,{children:e.jsx(i,{})})}),F=[{id:"overview",label:"Overview",href:"/overview"},{id:"checks",label:"Checks",href:"/checks"},{id:"tracks",label:"Tracks",href:"/tracks"},{id:"campaigns",label:"Campaigns",href:"/campaigns"}],u=Array.from({length:20},(i,n)=>e.jsx(t,{as:"p",children:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."},n)),o=m.story({decorators:[c],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"My Plugin"}),e.jsx(r,{style:{backgroundColor:"#c3f0ff"},children:e.jsx(p,{children:e.jsx(t,{as:"p",children:"This content fills the remaining viewport height below the Header."})})})]})}),a=m.story({decorators:[c],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"My Plugin"}),e.jsx(r,{children:e.jsxs(p,{children:[e.jsx(t,{as:"h2",variant:"title-medium",children:"Scrollable Content"}),e.jsx(t,{as:"p",children:"The content below scrolls independently while the Header stays pinned at the top."}),u]})})]})}),s=m.story({decorators:[c],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"My Plugin",tabs:F}),e.jsx(r,{children:e.jsxs(p,{children:[e.jsx(t,{as:"p",children:"The FullPage height adjusts automatically when the Header includes tabs, thanks to the ResizeObserver measuring the Header's actual height."}),u]})})]})});o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{originalSource:`meta.story({
  decorators: [withRouter],
  render: () => <>
      <PluginHeader title="My Plugin" />
      <FullPage style={{
      backgroundColor: '#c3f0ff'
    }}>
        <Container>
          <Text as="p">
            This content fills the remaining viewport height below the Header.
          </Text>
        </Container>
      </FullPage>
    </>
})`,...o.input.parameters?.docs?.source}}};a.input.parameters={...a.input.parameters,docs:{...a.input.parameters?.docs,source:{originalSource:`meta.story({
  decorators: [withRouter],
  render: () => <>
      <PluginHeader title="My Plugin" />
      <FullPage>
        <Container>
          <Text as="h2" variant="title-medium">
            Scrollable Content
          </Text>
          <Text as="p">
            The content below scrolls independently while the Header stays
            pinned at the top.
          </Text>
          {paragraphs}
        </Container>
      </FullPage>
    </>
})`,...a.input.parameters?.docs?.source}}};s.input.parameters={...s.input.parameters,docs:{...s.input.parameters?.docs,source:{originalSource:`meta.story({
  decorators: [withRouter],
  render: () => <>
      <PluginHeader title="My Plugin" tabs={tabs} />
      <FullPage>
        <Container>
          <Text as="p">
            The FullPage height adjusts automatically when the Header includes
            tabs, thanks to the ResizeObserver measuring the Header's actual
            height.
          </Text>
          {paragraphs}
        </Container>
      </FullPage>
    </>
})`,...s.input.parameters?.docs?.source}}};const ke=["Default","WithScrollableContent","WithTabs"];export{o as Default,a as WithScrollableContent,s as WithTabs,ke as __namedExportsOrder};
