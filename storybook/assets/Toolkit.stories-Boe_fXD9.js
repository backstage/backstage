import{j as o}from"./iframe-Bz1IoDwg.js";import{c as e}from"./plugin-q910FEE9.js";import{S as l}from"./Grid-DSK0Sob8.js";import{C as m}from"./ComponentAccordion-Blrc8U0E.js";import{w as a}from"./appWrappers-BObMNmL2.js";import{T as i}from"./TemplateBackstageLogoIcon-DIRSbIIf.js";import{I as s}from"./InfoCard-ceQikPA4.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-CE0ZYiwI.js";import"./componentData-7nshGulq.js";import"./useAnalytics-CTEKxLAM.js";import"./useApp-PKPW6CfH.js";import"./useRouteRef-DtU3fdAe.js";import"./index-CrqMr4SR.js";import"./DialogTitle-DuwIaY1G.js";import"./Modal-Bl681vyA.js";import"./Portal-nnGdoBnk.js";import"./Backdrop-ealuYeba.js";import"./Button-CfSoEum0.js";import"./useObservable-DO4febub.js";import"./useIsomorphicLayoutEffect-BDov4fhP.js";import"./ExpandMore-Dlvt5b42.js";import"./AccordionDetails-qNBrrRUw.js";import"./index-B9sM2jn7.js";import"./Collapse-C7ZfnDjZ.js";import"./useAsync-m1QKb3St.js";import"./useMountedState-CBRaKuhZ.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./CardContent-BQfvLFX1.js";import"./ErrorBoundary-ClRuUrD5.js";import"./ErrorPanel-BtAfCzwR.js";import"./WarningPanel-Bny1Wix5.js";import"./MarkdownContent-DPlVt8XM.js";import"./CodeSnippet-BhvDpqOl.js";import"./Box-B4X1pSLD.js";import"./styled-nJYZvWBJ.js";import"./CopyTextButton-B02pGVBs.js";import"./useCopyToClipboard-lsM1yAtv.js";import"./Tooltip-Dnn6Xi1p.js";import"./Popper-vOyuMRKf.js";import"./List-BuBw1TsS.js";import"./ListContext-BU0MJFdF.js";import"./ListItem-DwPXYlNl.js";import"./ListItemText-uP05tp0v.js";import"./LinkButton-BoLHewK-.js";import"./Link-BTTdXJ1E.js";import"./lodash-Czox7iJy.js";import"./CardHeader-B4_QbTWl.js";import"./Divider-D1ZXem9_.js";import"./CardActions-DxHgMSOJ.js";import"./BottomLink-DMb0ahl7.js";import"./ArrowForward-e_qRJmu3.js";const co={title:"Plugins/Home/Components/Toolkit",decorators:[n=>a(o.jsx(n,{}))],tags:["!manifest"]},r=()=>o.jsx(l,{item:!0,xs:12,md:6,children:o.jsx(e,{tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})})})}),t=()=>{const n=p=>o.jsx(m,{expanded:!0,...p});return o.jsx(s,{title:"Toolkit",noPadding:!0,children:o.jsxs(l,{item:!0,children:[o.jsx(e,{title:"Tools 1",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:n}),o.jsx(e,{title:"Tools 2",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m}),o.jsx(e,{title:"Tools 3",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m})]})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"InAccordion"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
