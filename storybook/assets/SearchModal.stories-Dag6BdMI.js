import{j as t,W as d,a3 as u,a2 as h}from"./iframe-COehFrpL.js";import{r as g}from"./plugin-CaEoeCM0.js";import{S as l,u as n,a as x}from"./useSearchModal-Bebjaw_V.js";import{B as c}from"./Button-D7f3kZ7f.js";import{D as S,a as f,b as M}from"./DialogTitle-C0PXsSKj.js";import{B as j}from"./Box-B7PQop3d.js";import{S as r}from"./Grid-BJ0wK3FV.js";import{S as C}from"./SearchType-DXUtUxJ0.js";import{L as y}from"./List-CiizdJ3F.js";import{H as I}from"./DefaultResultListItem-DYtkEKhq.js";import{w as R}from"./appWrappers-B1z8Wgg5.js";import{m as B}from"./makeStyles-D7As8WbR.js";import{s as D,M as k}from"./api-ELAkT2Un.js";import{S as v}from"./SearchContext-D5u-nHyj.js";import{SearchBar as T}from"./SearchBar-CCAHAfQF.js";import{S as b}from"./SearchResult-DkiFb1uV.js";import"./preload-helper-PPVm8Dsz.js";import"./index-C40Ggyls.js";import"./Plugin-B0bg8bYc.js";import"./componentData-Bv-OxL3r.js";import"./useAnalytics-MdDpEXUp.js";import"./useApp-B2bmOZiO.js";import"./useRouteRef-D1L3DfL_.js";import"./ArrowForward-DXylIA_F.js";import"./translation-CNXYhEv0.js";import"./Page-vPLmE_tC.js";import"./useMediaQuery-iJ9ch_1_.js";import"./Divider-e4wJPda_.js";import"./ArrowBackIos-BNUly0dA.js";import"./ArrowForwardIos-EU0BfvCs.js";import"./translation-BF3KAZ4f.js";import"./Modal-MCEmRc8K.js";import"./Portal-BDUo5n07.js";import"./Backdrop-BqHAdTxg.js";import"./styled-CHPGtv4W.js";import"./ExpandMore-Dty7EJAS.js";import"./useAsync-B4wUCKvR.js";import"./useMountedState-B99v9kbG.js";import"./AccordionDetails-D82uV10E.js";import"./index-B9sM2jn7.js";import"./Collapse-B1e5vrwf.js";import"./ListItem-KCvGwAe0.js";import"./ListContext-BRvGbkkj.js";import"./ListItemIcon-0fVaeVMr.js";import"./ListItemText-DrxBjBT1.js";import"./Tabs-C52wf9xN.js";import"./KeyboardArrowRight-D9OgIs8H.js";import"./FormLabel-Ci9H5t9f.js";import"./formControlState-BZoyfJEl.js";import"./InputLabel-Dv0h9btU.js";import"./Select-CIYkT4YT.js";import"./Popover-BdwdwPwj.js";import"./MenuItem-B4LM0Sq9.js";import"./Checkbox-B7OGcIUJ.js";import"./SwitchBase-CEyUg0g9.js";import"./Chip-BatGkav1.js";import"./Link-B7XO7g3U.js";import"./index-a-YDJ9fl.js";import"./lodash-FtczDCAx.js";import"./WebStorage-yF7QnIog.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-BsDDQtlz.js";import"./useIsomorphicLayoutEffect-C1ydkRN7.js";import"./BUIProvider-Be41rQEI.js";import"./openLink-Df95N0dK.js";import"./useResolvedHref-B_8OEdp3.js";import"./Search-BGTGVvhx.js";import"./useDebounce-DeaxTw46.js";import"./InputAdornment-CkwPflyO.js";import"./TextField-CodV5cdJ.js";import"./useElementFilter-T-usqU0t.js";import"./EmptyState-C_yattB0.js";import"./Progress-Fxy9oE-W.js";import"./LinearProgress-i1p_pk4j.js";import"./ResponseErrorPanel-BZm-Yu1O.js";import"./ErrorPanel-sHOo08CV.js";import"./WarningPanel-C3YsvByL.js";import"./MarkdownContent-Bgg942nC.js";import"./CodeSnippet-DANPGiIq.js";import"./CopyTextButton-CqT9rzTe.js";import"./useCopyToClipboard-XYtayGRj.js";import"./Tooltip-D5cXJRas.js";import"./Popper-Dg2-j-PV.js";const G={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},co={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>R(t.jsx(h,{apis:[[D,new k(G)]],children:t.jsx(v,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":g}})],tags:["!manifest"]},i=()=>{const{state:o,toggleModal:a}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:a,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:a})]})},A=B(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),s=()=>{const o=A(),{state:a,toggleModal:e}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:e,children:"Toggle Custom Search Modal"}),t.jsx(l,{...a,toggleModal:e,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(S,{children:t.jsxs(j,{className:o.titleContainer,children:[t.jsx(T,{className:o.input}),t.jsx(d,{"aria-label":"close",onClick:e,children:t.jsx(u,{})})]})}),t.jsx(f,{children:t.jsxs(r,{container:!0,direction:"column",children:[t.jsx(r,{item:!0,children:t.jsx(C.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(r,{item:!0,children:t.jsx(b,{children:({results:p})=>t.jsx(y,{children:p.map(({document:m})=>t.jsx("div",{role:"button",tabIndex:0,onClick:e,onKeyPress:e,children:t.jsx(I,{result:m},m.location)},`${m.location}-btn`))})})})]})}),t.jsx(M,{className:o.dialogActionsContainer,children:t.jsx(r,{container:!0,direction:"row",children:t.jsx(r,{item:!0,xs:12,children:t.jsx(x,{})})})})]})})]})};i.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`() => {
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
