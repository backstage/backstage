import{j as t,W as d,a3 as u,a2 as h}from"./iframe-D4ojcRBn.js";import{r as g}from"./plugin-BZ4Yex1o.js";import{S as l,u as n,a as x}from"./useSearchModal-BuD3cA1r.js";import{B as c}from"./Button-CfkeaZjm.js";import{D as S,a as f,b as M}from"./DialogTitle-iMXuoh45.js";import{B as j}from"./Box-laszcGHL.js";import{S as r}from"./Grid-DTyJ7xkb.js";import{S as C}from"./SearchType-nyj4dRsk.js";import{L as y}from"./List-F0S5B9Dv.js";import{H as I}from"./DefaultResultListItem-FwxmED3v.js";import{w as R}from"./appWrappers-C18BGkh-.js";import{m as B}from"./makeStyles-Cl-w1ABh.js";import{s as D,M as k}from"./api-CG7Yri57.js";import{S as v}from"./SearchContext-Bwuvkf_B.js";import{SearchBar as T}from"./SearchBar-DehevPv1.js";import{S as b}from"./SearchResult-Cm5pkSLT.js";import"./preload-helper-PPVm8Dsz.js";import"./index-z_rlBvNL.js";import"./Plugin-HuiQHv00.js";import"./componentData-BbfOzAVr.js";import"./useAnalytics-09trSmCC.js";import"./useApp-D8s9Wbol.js";import"./useRouteRef-D4mMn1ND.js";import"./ArrowForward-B7bJrHLO.js";import"./translation-m4Z2FeYY.js";import"./Page-6EbLHWl-.js";import"./useMediaQuery-Dvi-4iTW.js";import"./Divider-DPJDNd0s.js";import"./ArrowBackIos-BHU2Zwaq.js";import"./ArrowForwardIos-C1FjFk3z.js";import"./translation-2IWac1Em.js";import"./Modal-DJW-GyYR.js";import"./Portal-CTav-3Kk.js";import"./Backdrop-D0YUGidG.js";import"./styled-DZLwQIlI.js";import"./ExpandMore-VVYq8_kD.js";import"./useAsync-BUOFjVsl.js";import"./useMountedState-Dd8_3eVW.js";import"./AccordionDetails-C_SvNiGJ.js";import"./index-B9sM2jn7.js";import"./Collapse-DFs2mBo2.js";import"./ListItem-B4NcQ-mY.js";import"./ListContext-S6LlGKy0.js";import"./ListItemIcon-DFfD_X0n.js";import"./ListItemText-DqjEjuKL.js";import"./Tabs-v25_eZiW.js";import"./KeyboardArrowRight-nD3tSXqr.js";import"./FormLabel-CKacr3k-.js";import"./formControlState-DPQG6hOS.js";import"./InputLabel-b8Oxmg5H.js";import"./Select-BLtFOxar.js";import"./Popover-Br3Mvmbr.js";import"./MenuItem-Cff9LskS.js";import"./Checkbox-D0WerLZg.js";import"./SwitchBase-B8te7Ba6.js";import"./Chip-B7KiQxvh.js";import"./Link-BY--rZrj.js";import"./index-DW-rjBCk.js";import"./lodash-B6rdiaVd.js";import"./WebStorage-CWhMStFC.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-BwvneYqt.js";import"./useIsomorphicLayoutEffect-Bc6gHKgZ.js";import"./BUIProvider-C7o04JVY.js";import"./openLink-Dgpda5ne.js";import"./useResolvedHref-CTsd7mun.js";import"./Search-DuEblrgq.js";import"./useDebounce-CcEN9U41.js";import"./InputAdornment-BfcBZ5k1.js";import"./TextField-BNi4JUHB.js";import"./useElementFilter-Dw0OuJO0.js";import"./EmptyState-C45WLeTp.js";import"./Progress-CTfwz6Aw.js";import"./LinearProgress-DQOqEyYP.js";import"./ResponseErrorPanel-ypMJsa8L.js";import"./ErrorPanel-CYxdwLAi.js";import"./WarningPanel-DdSVSS0t.js";import"./MarkdownContent-DKcQcqUM.js";import"./CodeSnippet-jM5cvvbc.js";import"./CopyTextButton-CeIJGoRH.js";import"./useCopyToClipboard-DKzr7rta.js";import"./Tooltip-CrYI3p8-.js";import"./Popper-CS4j-s-3.js";const G={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},co={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>R(t.jsx(h,{apis:[[D,new k(G)]],children:t.jsx(v,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":g}})],tags:["!manifest"]},i=()=>{const{state:o,toggleModal:a}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:a,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:a})]})},A=B(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),s=()=>{const o=A(),{state:a,toggleModal:e}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:e,children:"Toggle Custom Search Modal"}),t.jsx(l,{...a,toggleModal:e,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(S,{children:t.jsxs(j,{className:o.titleContainer,children:[t.jsx(T,{className:o.input}),t.jsx(d,{"aria-label":"close",onClick:e,children:t.jsx(u,{})})]})}),t.jsx(f,{children:t.jsxs(r,{container:!0,direction:"column",children:[t.jsx(r,{item:!0,children:t.jsx(C.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(r,{item:!0,children:t.jsx(b,{children:({results:p})=>t.jsx(y,{children:p.map(({document:m})=>t.jsx("div",{role:"button",tabIndex:0,onClick:e,onKeyPress:e,children:t.jsx(I,{result:m},m.location)},`${m.location}-btn`))})})})]})}),t.jsx(M,{className:o.dialogActionsContainer,children:t.jsx(r,{container:!0,direction:"row",children:t.jsx(r,{item:!0,xs:12,children:t.jsx(x,{})})})})]})})]})};i.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`() => {
  const {
    state,
    toggleModal
  } = useSearchModal();
  return <>
      <Button variant="contained" color="primary" onClick={toggleModal}>
        Toggle Search Modal
      </Button>
      <SearchModal {...state} toggleModal={toggleModal} />
    </>;
}`,...i.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`() => {
  const classes = useStyles();
  const {
    state,
    toggleModal
  } = useSearchModal();
  return <>
      <Button variant="contained" color="primary" onClick={toggleModal}>
        Toggle Custom Search Modal
      </Button>
      <SearchModal {...state} toggleModal={toggleModal}>
        {() => <>
            <DialogTitle>
              <Box className={classes.titleContainer}>
                <SearchBar className={classes.input} />

                <IconButton aria-label="close" onClick={toggleModal}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container direction="column">
                <Grid item>
                  <SearchType.Tabs defaultValue="" types={[{
                value: 'custom-result-item',
                name: 'Custom Item'
              }, {
                value: 'no-custom-result-item',
                name: 'No Custom Item'
              }]} />
                </Grid>
                <Grid item>
                  <SearchResult>
                    {({
                  results
                }) => <List>
                        {results.map(({
                    document
                  }) => <div role="button" tabIndex={0} key={\`\${document.location}-btn\`} onClick={toggleModal} onKeyPress={toggleModal}>
                            <DefaultResultListItem key={document.location} result={document} />
                          </div>)}
                      </List>}
                  </SearchResult>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions className={classes.dialogActionsContainer}>
              <Grid container direction="row">
                <Grid item xs={12}>
                  <SearchResultPager />
                </Grid>
              </Grid>
            </DialogActions>
          </>}
      </SearchModal>
    </>;
}`,...s.parameters?.docs?.source}}};const po=["Default","CustomModal"];export{s as CustomModal,i as Default,po as __namedExportsOrder,co as default};
