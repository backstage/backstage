import{j as t,T as p,c,C as l,m as i,a as d}from"./iframe-QBX5Mcuo.js";import{s as g,H as u}from"./plugin-bJWcIHXu.js";import{c as h}from"./api-B5MZnkeh.js";import{c as f}from"./catalogApiMock-DvDFDFxj.js";import{s as x}from"./api-DRjUYJBX.js";import{S as y}from"./SearchContext-BTMcT43M.js";import{P as S}from"./Page-3RUo4jF9.js";import{S as r}from"./Grid-Q_BfCJNG.js";import{b as k,a as j,c as C}from"./plugin-DLAShKum.js";import{T as P}from"./TemplateBackstageLogo-6pKoH4Fz.js";import{T}from"./TemplateBackstageLogoIcon-BD7Keupn.js";import{e as I}from"./routes-BFuSrePD.js";import{w as v}from"./appWrappers-357IU-cP.js";import{s as G}from"./StarredEntitiesApi-DyJW51GS.js";import{M as A}from"./MockStarredEntitiesApi-CKUkCn_q.js";import{I as B}from"./InfoCard-DyGnoqeb.js";import"./preload-helper-D9Z9MdNV.js";import"./index-BWOdk6pr.js";import"./Plugin-BpVAfwk3.js";import"./componentData-DHgvWv9V.js";import"./useAnalytics-Pg_QG9Iq.js";import"./useApp-B1pSEwwD.js";import"./useRouteRef-Bc19hZiH.js";import"./index-CDF8GVFg.js";import"./ref-C0VTUPuL.js";import"./lodash-CwBbdt2Q.js";import"./useAsync-DruiAlTJ.js";import"./useMountedState-ByMBzLYV.js";import"./DialogTitle-BSYcyeQj.js";import"./Modal-B7uRaYS1.js";import"./Portal-D97HJh_z.js";import"./Backdrop-DUF8g36-.js";import"./Button-CVwDhsqF.js";import"./useObservable-BTlRHWB4.js";import"./useIsomorphicLayoutEffect-BYNl4sdH.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./CardContent-BGq9ULfl.js";import"./ErrorBoundary-DDmUM-RT.js";import"./ErrorPanel-Bnda3tGm.js";import"./WarningPanel-Ct6Y8Ijr.js";import"./ExpandMore-j96Z6uWc.js";import"./AccordionDetails-D8gh-z9a.js";import"./index-DnL3XN75.js";import"./Collapse-vSwdBrKa.js";import"./MarkdownContent-CGXvyksG.js";import"./CodeSnippet-Kn9vBnai.js";import"./Box-DE6c26DR.js";import"./styled-BjXftXcZ.js";import"./CopyTextButton-CQwOrqNE.js";import"./useCopyToClipboard-B79QevPK.js";import"./Tooltip-DOW7o-0E.js";import"./Popper-BpKCcSKx.js";import"./List-CwkTxoFK.js";import"./ListContext-BfMtnPb8.js";import"./ListItem-CcSyfWmu.js";import"./ListItemText-BayZFfOR.js";import"./LinkButton-CSuChLvM.js";import"./Link-C2fIupIe.js";import"./CardHeader-kma2G_Yg.js";import"./Divider-DLQMODSR.js";import"./CardActions-BO1Jtm9a.js";import"./BottomLink-BnuP6Yck.js";import"./ArrowForward-C05mkkQp.js";const b=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],E=f({entities:b}),a=new A;a.toggleStarred("component:default/example-starred-entity");a.toggleStarred("component:default/example-starred-entity-2");a.toggleStarred("component:default/example-starred-entity-3");a.toggleStarred("component:default/example-starred-entity-4");const Wt={title:"Plugins/Home/Templates",decorators:[e=>v(t.jsx(t.Fragment,{children:t.jsx(p,{apis:[[h,E],[G,a],[x,{query:()=>Promise.resolve({results:[]})}],[c,new l({stackoverflow:{baseUrl:"https://api.stackexchange.com/2.2"}})]],children:t.jsx(e,{})})}),{mountedRoutes:{"/hello-company":g.routes.root,"/catalog/:namespace/:kind/:name":I}})]},H=i(e=>({searchBarInput:{maxWidth:"60vw",margin:"auto",backgroundColor:e.palette.background.paper,borderRadius:"50px",boxShadow:e.shadows[1]},searchBarOutline:{borderStyle:"none"}})),R=i(e=>({container:{margin:e.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),o=()=>{const e=H(),{svg:s,path:n,container:m}=R();return t.jsx(y,{children:t.jsx(S,{themeId:"home",children:t.jsx(d,{children:t.jsxs(r,{container:!0,justifyContent:"center",spacing:6,children:[t.jsx(k,{className:m,logo:t.jsx(P,{classes:{svg:s,path:n}})}),t.jsx(r,{container:!0,item:!0,xs:12,justifyContent:"center",children:t.jsx(u,{InputProps:{classes:{root:e.searchBarInput,notchedOutline:e.searchBarOutline}},placeholder:"Search"})}),t.jsxs(r,{container:!0,item:!0,xs:12,children:[t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(j,{})}),t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(C,{tools:Array(8).fill({url:"#",label:"link",icon:t.jsx(T,{})})})}),t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(B,{title:"Composable Section",children:t.jsx("div",{style:{height:370}})})})]})]})})})})};o.__docgenInfo={description:"",methods:[],displayName:"DefaultTemplate"};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`() => {
  const classes = useStyles();
  const {
    svg,
    path,
    container
  } = useLogoStyles();
  return <SearchContextProvider>
      <Page themeId="home">
        <Content>
          <Grid container justifyContent="center" spacing={6}>
            <HomePageCompanyLogo className={container} logo={<TemplateBackstageLogo classes={{
            svg,
            path
          }} />} />
            <Grid container item xs={12} justifyContent="center">
              <HomePageSearchBar InputProps={{
              classes: {
                root: classes.searchBarInput,
                notchedOutline: classes.searchBarOutline
              }
            }} placeholder="Search" />
            </Grid>
            <Grid container item xs={12}>
              <Grid item xs={12} md={6}>
                <HomePageStarredEntities />
              </Grid>
              <Grid item xs={12} md={6}>
                <HomePageToolkit tools={Array(8).fill({
                url: '#',
                label: 'link',
                icon: <TemplateBackstageLogoIcon />
              })} />
              </Grid>
              <Grid item xs={12} md={6}>
                <InfoCard title="Composable Section">
                  {/* placeholder for content */}
                  <div style={{
                  height: 370
                }} />
                </InfoCard>
              </Grid>
            </Grid>
          </Grid>
        </Content>
      </Page>
    </SearchContextProvider>;
}`,...o.parameters?.docs?.source}}};const zt=["DefaultTemplate"];export{o as DefaultTemplate,zt as __namedExportsOrder,Wt as default};
