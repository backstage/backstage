import{be as b,c8 as x,cE as P,bQ as e,c5 as f,w as y}from"./iframe-J3scbCK7.js";import{P as l}from"./PluginHeader-CdvzVZLA.js";import{C as p}from"./Container-U7FT7DwG.js";import{T as t}from"./Text-CB1952Wg.js";import{B as j}from"./BUIProvider-BM3j6qBn.js";import"./preload-helper-PPVm8Dsz.js";import"./index-dtgEZu1w.js";import"./utils-CXCc_oGJ.js";import"./useObjectRef-CYiyNzgW.js";import"./useCollection-CYZW3AoK.js";import"./useFocusRing-lNGJkQ5U.js";import"./openLink-BYbBBzFI.js";import"./Hidden-RMOzfft_.js";import"./keyboard-D2Y4eCz5.js";import"./FocusScope-CZ1AJ7eH.js";import"./useEvent-B3GM1Fij.js";import"./I18nProvider-BmKrAj2D.js";import"./usePress-oQ0Te5kE.js";import"./textSelection-QyuURRcd.js";import"./useControlledState-DShAbZI7.js";import"./Link-BhdFxRQK.js";import"./useLink-ddv6TvwU.js";import"./useHover-CwRlhx06.js";import"./useLocalizedStringFormatter-Xrd7W-Po.js";import"./Button-BRjZSFG-.js";import"./Label-CZdg3p-k.js";import"./useLabel-CdAWakw3.js";import"./useLabels-tuukLlho.js";import"./number-B1XZmGQH.js";import"./useButton-Dz9TOBMM.js";import"./Menu-B0kBJY-x.js";import"./Autocomplete--nAxv__n.js";import"./getItemCount-P9T_ZwX3.js";import"./Input-DPORZ8J4.js";import"./ListBox-UrDHST0o.js";import"./Text-DH7_sXsF.js";import"./useListState-Dm4dYv4O.js";import"./Dialog-CRe_krMo.js";import"./Heading-BmSTr2hW.js";import"./useOverlayTriggerState-Djk9kxal.js";import"./VisuallyHidden-DDRaOimJ.js";import"./animation-CIWnDDLd.js";import"./SearchField-BMKtrOTg.js";import"./FieldError-B0c2RKK0.js";import"./useFormValidation-zrBOIZdf.js";import"./useTextField-B3ICUpsH.js";import"./useField-CqTLy_Vm.js";import"./useFormReset-DtBlZ5rd.js";import"./Virtualizer-M75QQLvE.js";import"./useFilter-Ba4xXVuI.js";import"./getNodeText-D0CW-I5U.js";import"./Link-1vnyRbam.js";import"./useResolvedHref-D6E2eFAl.js";import"./Tooltip-gmbmHZ4e.js";import"./VisuallyHidden-C-d-RpeY.js";import"./Tabs-Dd-_kdyk.js";import"./useHasTabbableChild-B7FaILbE.js";import"./BUIRoutingProvider-jvw1N9sz.js";const w={"bui-FullPage":"_bui-FullPage_1vdnu_20"},T=b()({styles:w,classNames:{root:"bui-FullPage"},propDefs:{className:{}}}),r=x.forwardRef((i,n)=>{const{ownProps:d,restProps:h}=P(T,i),{classes:g}=d;return e.jsx("main",{ref:n,className:g.root,...h})});r.__docgenInfo={description:`A component that fills the remaining viewport height below the Header.

The FullPage component consumes the \`--bui-header-height\` CSS custom property
set by the Header component to calculate its height as
\`calc(100dvh - var(--bui-header-height, 0px))\`. Content inside the FullPage
scrolls independently while the Header stays visible.

@public`,methods:[],displayName:"FullPage",props:{className:{required:!1,tsType:{name:"string"},description:""}},composes:["Omit"]};const m=f.meta({title:"Backstage UI/FullPage",component:r,parameters:{layout:"fullscreen"}}),c=i=>e.jsx(y,{children:e.jsx(j,{children:e.jsx(i,{})})}),F=[{id:"overview",label:"Overview",href:"/overview"},{id:"checks",label:"Checks",href:"/checks"},{id:"tracks",label:"Tracks",href:"/tracks"},{id:"campaigns",label:"Campaigns",href:"/campaigns"}],u=Array.from({length:20},(i,n)=>e.jsx(t,{as:"p",children:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."},n)),o=m.story({decorators:[c],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"My Plugin"}),e.jsx(r,{style:{backgroundColor:"#c3f0ff"},children:e.jsx(p,{children:e.jsx(t,{as:"p",children:"This content fills the remaining viewport height below the Header."})})})]})}),s=m.story({decorators:[c],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"My Plugin"}),e.jsx(r,{children:e.jsxs(p,{children:[e.jsx(t,{as:"h2",variant:"title-medium",children:"Scrollable Content"}),e.jsx(t,{as:"p",children:"The content below scrolls independently while the Header stays pinned at the top."}),u]})})]})}),a=m.story({decorators:[c],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"My Plugin",tabs:F}),e.jsx(r,{children:e.jsxs(p,{children:[e.jsx(t,{as:"p",children:"The FullPage height adjusts automatically when the Header includes tabs, thanks to the ResizeObserver measuring the Header's actual height."}),u]})})]})});o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...o.input.parameters?.docs?.source}}};s.input.parameters={...s.input.parameters,docs:{...s.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...s.input.parameters?.docs?.source}}};a.input.parameters={...a.input.parameters,docs:{...a.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...a.input.parameters?.docs?.source}}};const Se=["Default","WithScrollableContent","WithTabs"];export{o as Default,s as WithScrollableContent,a as WithTabs,Se as __namedExportsOrder};
