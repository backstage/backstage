import{j as o}from"./iframe-Du4yWFmh.js";import{c as e}from"./plugin-DgWnl-36.js";import{S as l}from"./Grid-BAWrmmwT.js";import{C as m}from"./ComponentAccordion-25A77G-T.js";import{w as a}from"./appWrappers-C6fp3G6q.js";import{T as i}from"./TemplateBackstageLogoIcon-tBv22kEk.js";import{I as s}from"./InfoCard-BlSgdS8H.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-tqD9UBew.js";import"./componentData-Cum-Z3JG.js";import"./useAnalytics-mdAgoHs9.js";import"./useApp-DvME4Mfb.js";import"./useRouteRef-C6zbOJHI.js";import"./index-Br3zvZN_.js";import"./DialogTitle-Cps86Mxp.js";import"./Modal-CcLAGJZ_.js";import"./Portal-CRhyxH_K.js";import"./Backdrop-Bdb7V_oo.js";import"./Button-C5V9YZrj.js";import"./useObservable-BMdH8T7u.js";import"./useIsomorphicLayoutEffect-CE2PLaCN.js";import"./ExpandMore-B4oHnhmj.js";import"./AccordionDetails-Bs2ZQrVE.js";import"./index-B9sM2jn7.js";import"./Collapse-CJL9VCPm.js";import"./useAsync-BpPAnWcd.js";import"./useMountedState-DMz1NfKI.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./CardContent-AeX-1A09.js";import"./ErrorBoundary-BfVWC_KB.js";import"./ErrorPanel-Bjzvo6fH.js";import"./WarningPanel-YDZfKCG0.js";import"./MarkdownContent-DScxBhmk.js";import"./CodeSnippet-QaiBHOZa.js";import"./Box-CkOOyHi_.js";import"./styled-B5kNIoL_.js";import"./CopyTextButton-zIe-ESin.js";import"./useCopyToClipboard-GTE9QNgz.js";import"./Tooltip-CxJ8vwKd.js";import"./Popper-Bc6CEfjX.js";import"./List-C8YUr1Px.js";import"./ListContext-CCATEDcQ.js";import"./ListItem-CR_jODVH.js";import"./ListItemText-BFdXXm3F.js";import"./LinkButton-B11jcSTr.js";import"./Link-BchXRwcV.js";import"./lodash-DLuUt6m8.js";import"./CardHeader-DmTNyK4m.js";import"./Divider-BJZ8WmAv.js";import"./CardActions-F6l5rDAo.js";import"./BottomLink-YrEzVC2D.js";import"./ArrowForward-tmFPzWCr.js";const co={title:"Plugins/Home/Components/Toolkit",decorators:[n=>a(o.jsx(n,{}))],tags:["!manifest"]},r=()=>o.jsx(l,{item:!0,xs:12,md:6,children:o.jsx(e,{tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})})})}),t=()=>{const n=p=>o.jsx(m,{expanded:!0,...p});return o.jsx(s,{title:"Toolkit",noPadding:!0,children:o.jsxs(l,{item:!0,children:[o.jsx(e,{title:"Tools 1",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:n}),o.jsx(e,{title:"Tools 2",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m}),o.jsx(e,{title:"Tools 3",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m})]})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"InAccordion"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
