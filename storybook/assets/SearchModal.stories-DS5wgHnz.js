import{j as t,W as d,a3 as u,a2 as h}from"./iframe-CsCfxPn_.js";import{r as g}from"./plugin-lnE88ffz.js";import{S as l,u as n,a as x}from"./useSearchModal-BLvnHxzy.js";import{B as c}from"./Button-Cne4OJP9.js";import{D as S,a as f,b as M}from"./DialogTitle-CO0UmowJ.js";import{B as j}from"./Box-B59PrcF8.js";import{S as r}from"./Grid-BYa8idma.js";import{S as C}from"./SearchType-DvrB-D89.js";import{L as y}from"./List-BOkqMN_K.js";import{H as I}from"./DefaultResultListItem-DBa5MyE2.js";import{w as R}from"./appWrappers-B9IK4atE.js";import{m as B}from"./makeStyles-Cyq7q47K.js";import{s as D,M as k}from"./api-CpAFkP7v.js";import{S as v}from"./SearchContext-BFk6HlnE.js";import{SearchBar as T}from"./SearchBar-ClppP2XG.js";import{S as b}from"./SearchResult-B9i6w4Pg.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BEfEUu9U.js";import"./Plugin-Brd-M73I.js";import"./componentData-CHkqD8ZG.js";import"./useAnalytics-w4gYjMWf.js";import"./useApp-C_ncuDBH.js";import"./useRouteRef-D_n0iugk.js";import"./ArrowForward-DSCf3QB5.js";import"./translation-C-rubP8K.js";import"./Page-DGhx1dmv.js";import"./useMediaQuery-DzU9nR6M.js";import"./Divider-ENESGlaF.js";import"./ArrowBackIos-COW7S9Xn.js";import"./ArrowForwardIos-CBiIX6HM.js";import"./translation-8GdlkoAv.js";import"./Modal-Bpr0arJu.js";import"./Portal-Mjfg2QfE.js";import"./Backdrop-DNPdC6Y3.js";import"./styled-BhaEuEq4.js";import"./ExpandMore-B9sgAbKb.js";import"./useAsync-BnuMT2jk.js";import"./useMountedState-BfmURTRU.js";import"./AccordionDetails-BQZ4KF5G.js";import"./index-B9sM2jn7.js";import"./Collapse-C8jxEJfU.js";import"./ListItem-DLLda7RJ.js";import"./ListContext-COVYUNkn.js";import"./ListItemIcon-DbUr_XUW.js";import"./ListItemText-Bb_WjaoQ.js";import"./Tabs-B96jP5iW.js";import"./KeyboardArrowRight-iUuMQklX.js";import"./FormLabel-C6W7R7YI.js";import"./formControlState-CtyFG1bY.js";import"./InputLabel-ry21DTPP.js";import"./Select-SaMwXIqU.js";import"./Popover-B3s2h15z.js";import"./MenuItem-BNpo4vkR.js";import"./Checkbox-BwcU474v.js";import"./SwitchBase-Dxy-w4cB.js";import"./Chip-DKM9i7tp.js";import"./Link-BZkyGUYJ.js";import"./index-BnA6fLC5.js";import"./lodash-CbHAjvV7.js";import"./WebStorage-OFUHyLIx.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-CQg4fRRq.js";import"./useIsomorphicLayoutEffect-BDGfUn1p.js";import"./BUIProvider-Chhfm5Ik.js";import"./openLink-BrP_7GAS.js";import"./useResolvedHref-QiPi986T.js";import"./Search-BJrutyA5.js";import"./useDebounce-BoRW1tiC.js";import"./InputAdornment-BxcR6WbN.js";import"./TextField-BpKpkp_U.js";import"./useElementFilter-DPoWGLlH.js";import"./EmptyState-nI1dRGJN.js";import"./Progress-gl1ElNMR.js";import"./LinearProgress-ZkmiOVRR.js";import"./ResponseErrorPanel-Dp1oup9Z.js";import"./ErrorPanel-DytSTv92.js";import"./WarningPanel-DOkLgdmd.js";import"./MarkdownContent-Cr-4rCA9.js";import"./CodeSnippet-D-7-vDxV.js";import"./CopyTextButton-Dz_soge8.js";import"./useCopyToClipboard-Cqod-UND.js";import"./Tooltip-DGsNX3s4.js";import"./Popper-CCu5RvlF.js";const G={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},co={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>R(t.jsx(h,{apis:[[D,new k(G)]],children:t.jsx(v,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":g}})],tags:["!manifest"]},i=()=>{const{state:o,toggleModal:a}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:a,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:a})]})},A=B(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),s=()=>{const o=A(),{state:a,toggleModal:e}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:e,children:"Toggle Custom Search Modal"}),t.jsx(l,{...a,toggleModal:e,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(S,{children:t.jsxs(j,{className:o.titleContainer,children:[t.jsx(T,{className:o.input}),t.jsx(d,{"aria-label":"close",onClick:e,children:t.jsx(u,{})})]})}),t.jsx(f,{children:t.jsxs(r,{container:!0,direction:"column",children:[t.jsx(r,{item:!0,children:t.jsx(C.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(r,{item:!0,children:t.jsx(b,{children:({results:p})=>t.jsx(y,{children:p.map(({document:m})=>t.jsx("div",{role:"button",tabIndex:0,onClick:e,onKeyPress:e,children:t.jsx(I,{result:m},m.location)},`${m.location}-btn`))})})})]})}),t.jsx(M,{className:o.dialogActionsContainer,children:t.jsx(r,{container:!0,direction:"row",children:t.jsx(r,{item:!0,xs:12,children:t.jsx(x,{})})})})]})})]})};i.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`() => {
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
