import{j as o}from"./iframe-BNEamOZA.js";import{c as e}from"./plugin-nCcrX0DP.js";import{S as l}from"./Grid-CRwHHoKE.js";import{C as m}from"./ComponentAccordion-BJT2BLJh.js";import{w as a}from"./appWrappers-Cnm2FtIc.js";import{T as i}from"./TemplateBackstageLogoIcon-CksCJAa6.js";import{I as s}from"./InfoCard-CpGlQwlJ.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-BRYNsTLg.js";import"./componentData-Ci7GQLI0.js";import"./useAnalytics-CDZunouu.js";import"./useApp-D0ZSr7F9.js";import"./useRouteRef-B_Hzl5Hs.js";import"./index-eWkqxFkm.js";import"./DialogTitle-w4GpYJ__.js";import"./Modal-DO3msElT.js";import"./Portal-DTr3SEhf.js";import"./Backdrop-DFZc26u5.js";import"./Button-V9lH7kxA.js";import"./useObservable-B3f76rj0.js";import"./useIsomorphicLayoutEffect-B3lwMs3P.js";import"./ExpandMore-CsLuOGj_.js";import"./AccordionDetails-BJMgrmW8.js";import"./index-B9sM2jn7.js";import"./Collapse-OWL0PMb0.js";import"./useAsync-DTLzs39j.js";import"./useMountedState-Dry2TiBQ.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./CardContent-BUa5iOGm.js";import"./ErrorBoundary-BGRkzeHn.js";import"./ErrorPanel-DFxFI8yn.js";import"./WarningPanel-DQQjxQBT.js";import"./MarkdownContent-DXsGFVRJ.js";import"./CodeSnippet-C1V19_EM.js";import"./Box-3EsxCCm9.js";import"./styled-vJQyp9py.js";import"./CopyTextButton-D-HwPeLy.js";import"./useCopyToClipboard-B1J-P2VS.js";import"./Tooltip-Bujs_RiC.js";import"./Popper-DSZDidno.js";import"./List-DzzgZbq5.js";import"./ListContext-XsugHlK5.js";import"./ListItem-ZNxVQ_73.js";import"./ListItemText-DDE6HSA_.js";import"./LinkButton-_SotA3np.js";import"./Link-CYOaEznZ.js";import"./lodash-Y_-RFQgK.js";import"./CardHeader-S5lLzdjZ.js";import"./Divider-DHY-OV0t.js";import"./CardActions-dpaYtDWI.js";import"./BottomLink-Dtlg51dV.js";import"./ArrowForward-IiBET2Zy.js";const co={title:"Plugins/Home/Components/Toolkit",decorators:[n=>a(o.jsx(n,{}))]},r=()=>o.jsx(l,{item:!0,xs:12,md:6,children:o.jsx(e,{tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})})})}),t=()=>{const n=p=>o.jsx(m,{expanded:!0,...p});return o.jsx(s,{title:"Toolkit",noPadding:!0,children:o.jsxs(l,{item:!0,children:[o.jsx(e,{title:"Tools 1",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:n}),o.jsx(e,{title:"Tools 2",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m}),o.jsx(e,{title:"Tools 3",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m})]})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"InAccordion"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
  return <Grid item xs={12} md={6}>
      <HomePageToolkit tools={Array(8).fill({
      url: '#',
      label: 'link',
      icon: <TemplateBackstageLogoIcon />
    })} />
    </Grid>;
}`,...r.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
  const ExpandedComponentAccordion = (props: any) => <ComponentAccordion expanded {...props} />;
  return <InfoCard title="Toolkit" noPadding>
      <Grid item>
        <HomePageToolkit title="Tools 1" tools={Array(8).fill({
        url: '#',
        label: 'link',
        icon: <TemplateBackstageLogoIcon />
      })} Renderer={ExpandedComponentAccordion} />
        <HomePageToolkit title="Tools 2" tools={Array(8).fill({
        url: '#',
        label: 'link',
        icon: <TemplateBackstageLogoIcon />
      })} Renderer={ComponentAccordion} />
        <HomePageToolkit title="Tools 3" tools={Array(8).fill({
        url: '#',
        label: 'link',
        icon: <TemplateBackstageLogoIcon />
      })} Renderer={ComponentAccordion} />
      </Grid>
    </InfoCard>;
}`,...t.parameters?.docs?.source}}};const uo=["Default","InAccordion"];export{r as Default,t as InAccordion,uo as __namedExportsOrder,co as default};
