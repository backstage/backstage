import{j as t,S as d,a0 as u,$ as h}from"./iframe-BemVm3iW.js";import{r as g}from"./plugin-DN6LUTsY.js";import{S as m,u as n,a as x}from"./useSearchModal-ZJa2WidZ.js";import{B as c}from"./Button-Bd1A66p0.js";import{D as S,a as f,b as M}from"./DialogTitle-Cf1TvBk9.js";import{B as j}from"./Box-7KDenMHz.js";import{S as r}from"./Grid-DEKpYIQV.js";import{S as C}from"./SearchType-CI7iL4Kd.js";import{L as y}from"./List-DrSzlW8g.js";import{H as I}from"./DefaultResultListItem-CWTI6E00.js";import{w as R}from"./appWrappers-D41iQVtP.js";import{m as B}from"./makeStyles-C7F85DJE.js";import{s as D,M as k}from"./api-D1g2MG-A.js";import{S as v}from"./SearchContext-Beflz389.js";import{SearchBar as T}from"./SearchBar-Cq95rIbm.js";import{S as b}from"./SearchResult-B9LuqJB6.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BR7i2yep.js";import"./Plugin-BwyWHnES.js";import"./componentData-DVJ_rIR1.js";import"./useAnalytics-DC6bz4bN.js";import"./useApp-Cm_EfMWP.js";import"./useRouteRef-CIc70PM5.js";import"./ArrowForward-BSaUdY_l.js";import"./translation-CoTfWeDd.js";import"./Page-D9n57vzO.js";import"./useMediaQuery-DdsAXjhR.js";import"./Divider-DMpaR7VZ.js";import"./ArrowBackIos-D5spfgGc.js";import"./ArrowForwardIos-DqgSlOVU.js";import"./translation-GdvRqJ0Y.js";import"./Modal-C-JZpbYj.js";import"./Portal-CR5LO1QX.js";import"./Backdrop-rrgFMZ8Z.js";import"./styled-C58he6hV.js";import"./ExpandMore--lDgnP_6.js";import"./useAsync-DUWEv7Zd.js";import"./useMountedState-DjTA7C2l.js";import"./AccordionDetails-DTt7V5rY.js";import"./index-B9sM2jn7.js";import"./Collapse-IMjZlHsi.js";import"./ListItem-C4gGRMdA.js";import"./ListContext-ACqJPmwm.js";import"./ListItemIcon-CmdAgOiV.js";import"./ListItemText-Cci1p3Kg.js";import"./Tabs-CgxhS7cT.js";import"./KeyboardArrowRight-kIco0Bfz.js";import"./FormLabel-CuPz1hxR.js";import"./formControlState-H2g0p2Mf.js";import"./InputLabel-V7EzYp2W.js";import"./Select-BgvuokTp.js";import"./Popover-CMNFkA7u.js";import"./MenuItem-CjOVOby3.js";import"./Checkbox-uu6QaVM-.js";import"./SwitchBase-DWeJjl37.js";import"./Chip-BeQZKglo.js";import"./Link-cfxBzomB.js";import"./index-B743ax-R.js";import"./lodash-C0pW7aP-.js";import"./WebStorage-DhuHbnQ6.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-CeOKiVtN.js";import"./useIsomorphicLayoutEffect-CWSPwKWR.js";import"./BUIProvider-DorWgThn.js";import"./openLink-DsdV9ckj.js";import"./Search-D2qR9XNQ.js";import"./useDebounce-D7nlOA20.js";import"./InputAdornment-CzSTSBV6.js";import"./TextField-CBcA5s3V.js";import"./useElementFilter-wMBtzPYj.js";import"./EmptyState-hvUfQeqo.js";import"./Progress-DgvxxL2m.js";import"./LinearProgress-IeY-kfLG.js";import"./ResponseErrorPanel-DQK_3B0K.js";import"./ErrorPanel-DrgKHuXs.js";import"./WarningPanel-CM40nkjW.js";import"./MarkdownContent-DtZxppSm.js";import"./CodeSnippet-CkD9Jg-W.js";import"./CopyTextButton-ClwD2Tiu.js";import"./useCopyToClipboard-BH3nj1RT.js";import"./Tooltip-hyP9rZZW.js";import"./Popper-BaVns9-l.js";const G={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},no={title:"Plugins/Search/SearchModal",component:m,decorators:[o=>R(t.jsx(h,{apis:[[D,new k(G)]],children:t.jsx(v,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":g}})],tags:["!manifest"]},i=()=>{const{state:o,toggleModal:a}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:a,children:"Toggle Search Modal"}),t.jsx(m,{...o,toggleModal:a})]})},A=B(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),s=()=>{const o=A(),{state:a,toggleModal:e}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:e,children:"Toggle Custom Search Modal"}),t.jsx(m,{...a,toggleModal:e,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(S,{children:t.jsxs(j,{className:o.titleContainer,children:[t.jsx(T,{className:o.input}),t.jsx(d,{"aria-label":"close",onClick:e,children:t.jsx(u,{})})]})}),t.jsx(f,{children:t.jsxs(r,{container:!0,direction:"column",children:[t.jsx(r,{item:!0,children:t.jsx(C.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(r,{item:!0,children:t.jsx(b,{children:({results:p})=>t.jsx(y,{children:p.map(({document:l})=>t.jsx("div",{role:"button",tabIndex:0,onClick:e,onKeyPress:e,children:t.jsx(I,{result:l},l.location)},`${l.location}-btn`))})})})]})}),t.jsx(M,{className:o.dialogActionsContainer,children:t.jsx(r,{container:!0,direction:"row",children:t.jsx(r,{item:!0,xs:12,children:t.jsx(x,{})})})})]})})]})};i.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`() => {
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
}`,...s.parameters?.docs?.source}}};const co=["Default","CustomModal"];export{s as CustomModal,i as Default,co as __namedExportsOrder,no as default};
