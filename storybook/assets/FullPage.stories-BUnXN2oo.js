import{be as b,c8 as x,cE as P,bQ as e,c5 as f,w as y}from"./iframe-wUGVZK80.js";import{P as l}from"./PluginHeader-GqSGWqLA.js";import{C as p}from"./Container-Y96x6_HQ.js";import{T as t}from"./Text-C5GZ5c8P.js";import{B as j}from"./BUIProvider-BRk5MhI6.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CxFlMd0n.js";import"./utils-mEgVZwEH.js";import"./useObjectRef-Cer6noLc.js";import"./useCollection-DMwIrrK2.js";import"./useFocusRing-BC7vVkX4.js";import"./openLink-D6ixiiSG.js";import"./Hidden-yseb-6tt.js";import"./keyboard-DQLW8ZAU.js";import"./FocusScope-BtCRdK36.js";import"./useEvent-Co7ShWYJ.js";import"./I18nProvider-Ci8FoB4z.js";import"./usePress-0P_K_iFV.js";import"./textSelection-C7djrXyy.js";import"./useControlledState-BP7q2gJ8.js";import"./Link-BYT-yw0a.js";import"./useLink-B923cHLg.js";import"./useHover-DRcNaDP5.js";import"./useLocalizedStringFormatter-B0GnQ-25.js";import"./Button-d6OZAENs.js";import"./Label-CZ0yGWTb.js";import"./useLabel-r6Cj49-v.js";import"./useLabels-CANwnRLq.js";import"./number-vyQ0g_EM.js";import"./useButton-DkR_L0-r.js";import"./Menu-rvOVsivh.js";import"./Autocomplete-PQK_iJWN.js";import"./getItemCount-DoA8uYAv.js";import"./Input-NXPn2g8K.js";import"./ListBox-DWyTEJqb.js";import"./Text-nk-Fwv2h.js";import"./useListState-CuT9TiQ1.js";import"./Dialog-DLYL351a.js";import"./Heading-B1KZpqXO.js";import"./useOverlayTriggerState-BMbSord3.js";import"./VisuallyHidden-Br3tk3-5.js";import"./animation-CeCl3Lpx.js";import"./SearchField-BJK972h3.js";import"./FieldError-DakbevJf.js";import"./useFormValidation-DqwUvKPf.js";import"./useTextField-pS2dYT4L.js";import"./useField-CgH-KdhV.js";import"./useFormReset-CMPleS-P.js";import"./Virtualizer-YzI1j5st.js";import"./useFilter-Dc7YICpk.js";import"./getNodeText-Z_SxktXt.js";import"./Link-C49QHeNO.js";import"./useResolvedHref-DV-Il6Xp.js";import"./Tooltip-CNr5I1VM.js";import"./VisuallyHidden-DSir4uFP.js";import"./Tabs-CXkszs8M.js";import"./useHasTabbableChild-D_daaWx9.js";import"./BUIRoutingProvider-CBGIGxDQ.js";const w={"bui-FullPage":"_bui-FullPage_1vdnu_20"},T=b()({styles:w,classNames:{root:"bui-FullPage"},propDefs:{className:{}}}),r=x.forwardRef((i,n)=>{const{ownProps:d,restProps:h}=P(T,i),{classes:g}=d;return e.jsx("main",{ref:n,className:g.root,...h})});r.__docgenInfo={description:`A component that fills the remaining viewport height below the Header.

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
