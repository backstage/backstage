import{j as t,W as d,a3 as u,a2 as h}from"./iframe-nLmXqEf7.js";import{r as g}from"./plugin-DVzr-1pV.js";import{S as l,u as n,a as x}from"./useSearchModal-Gwre80kJ.js";import{B as c}from"./Button-BiqvEuEh.js";import{D as S,a as f,b as M}from"./DialogTitle-CuukYUP3.js";import{B as j}from"./Box-CyQmjUfD.js";import{S as r}from"./Grid-DKuUeREw.js";import{S as C}from"./SearchType-BFG4cFYk.js";import{L as y}from"./List-BIXTwaa6.js";import{H as I}from"./DefaultResultListItem-Dho49I1C.js";import{w as R}from"./appWrappers-Cbx55CTE.js";import{m as B}from"./makeStyles-CuMWFimH.js";import{s as D,M as k}from"./api-BxFFM04h.js";import{S as v}from"./SearchContext-BAmebm8g.js";import{SearchBar as T}from"./SearchBar-yzGZLcwD.js";import{S as b}from"./SearchResult-CssVijdg.js";import"./preload-helper-PPVm8Dsz.js";import"./index-Dyc9DkwK.js";import"./Plugin-DGz8jtYh.js";import"./componentData-Cx-dzaZC.js";import"./useAnalytics-BnxG_la1.js";import"./useApp-CRwfijY3.js";import"./useRouteRef-BPy_J9nN.js";import"./ArrowForward-DcRQcpHM.js";import"./translation-Gr4QfVu4.js";import"./Page-vssKsFyV.js";import"./useMediaQuery-ec1Rzs1D.js";import"./Divider-tRVzH__u.js";import"./ArrowBackIos-Diufq01b.js";import"./ArrowForwardIos-Cg_L-C8q.js";import"./translation-C7BwDU_x.js";import"./Modal-BRV6JJqO.js";import"./Portal-v2HYj7Sb.js";import"./Backdrop-CZLd4Qwb.js";import"./styled-Wwm-Ry3k.js";import"./ExpandMore-B5zrSqHS.js";import"./useAsync-CQxk_O5t.js";import"./useMountedState--VHycxnE.js";import"./AccordionDetails-BgO_FMaB.js";import"./index-B9sM2jn7.js";import"./Collapse-ZnPRc3O1.js";import"./ListItem-CNdv-BZq.js";import"./ListContext-C3nHO3D2.js";import"./ListItemIcon-DIMoJL6Z.js";import"./ListItemText-BG6mPEbD.js";import"./Tabs-BKyp-7D-.js";import"./KeyboardArrowRight-DWvX90kZ.js";import"./FormLabel-CqUCFzNo.js";import"./formControlState-Jq_OxEMR.js";import"./InputLabel-CC9Ru2tJ.js";import"./Select-zXQ8q8tK.js";import"./Popover-vuQOXVJR.js";import"./MenuItem-CkJJM3HT.js";import"./Checkbox-BLdvDCZA.js";import"./SwitchBase-D8_Q_6WO.js";import"./Chip-yl4qofN7.js";import"./Link-CmMZkdgv.js";import"./index-BfzHIfnW.js";import"./lodash-BuFazukY.js";import"./WebStorage-Bdca3qYN.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-Bv2vM6ff.js";import"./useIsomorphicLayoutEffect-B2OnfmC9.js";import"./BUIProvider-RETVTmQG.js";import"./openLink-52acbO8n.js";import"./useResolvedHref-D51FE2CM.js";import"./Search-DpCwBeaM.js";import"./useDebounce-BhAH6zf4.js";import"./InputAdornment-BNUJWeCn.js";import"./TextField-BhOa5voc.js";import"./useElementFilter-CPOy3zKm.js";import"./EmptyState-CMMHuQPW.js";import"./Progress-Czo0lx1Q.js";import"./LinearProgress-DRUjam-Z.js";import"./ResponseErrorPanel-GfVQx3ie.js";import"./ErrorPanel-ChwmzaN1.js";import"./WarningPanel-DOLTTqM1.js";import"./MarkdownContent-tMO6J2Hk.js";import"./CodeSnippet-mo9ifJNj.js";import"./CopyTextButton-qfi-W9IP.js";import"./useCopyToClipboard-D1QusNC-.js";import"./Tooltip-B2Qas7pH.js";import"./Popper-Cxd_FbSD.js";const G={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},co={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>R(t.jsx(h,{apis:[[D,new k(G)]],children:t.jsx(v,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":g}})],tags:["!manifest"]},i=()=>{const{state:o,toggleModal:a}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:a,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:a})]})},A=B(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),s=()=>{const o=A(),{state:a,toggleModal:e}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:e,children:"Toggle Custom Search Modal"}),t.jsx(l,{...a,toggleModal:e,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(S,{children:t.jsxs(j,{className:o.titleContainer,children:[t.jsx(T,{className:o.input}),t.jsx(d,{"aria-label":"close",onClick:e,children:t.jsx(u,{})})]})}),t.jsx(f,{children:t.jsxs(r,{container:!0,direction:"column",children:[t.jsx(r,{item:!0,children:t.jsx(C.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(r,{item:!0,children:t.jsx(b,{children:({results:p})=>t.jsx(y,{children:p.map(({document:m})=>t.jsx("div",{role:"button",tabIndex:0,onClick:e,onKeyPress:e,children:t.jsx(I,{result:m},m.location)},`${m.location}-btn`))})})})]})}),t.jsx(M,{className:o.dialogActionsContainer,children:t.jsx(r,{container:!0,direction:"row",children:t.jsx(r,{item:!0,xs:12,children:t.jsx(x,{})})})})]})})]})};i.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`() => {
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
